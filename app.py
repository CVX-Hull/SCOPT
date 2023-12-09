from flask import Flask, request, jsonify, send_from_directory, after_this_request
from optimize import *


app = Flask(__name__)


class BadRequestException(Exception):

    def __init__(self):
        pass


def convert_transactions(ts):
    return [{
        "location": t.loc,
        "commodity": t.com,
        "amount": t.amount
    } for t in ts]


def convert_plan(plan):
    plan_result = {"revenue": plan.revenue, "cost": plan.cost, "buyTransactions": convert_transactions(plan.buy),
                   "sellTransactions": convert_transactions(plan.sell)}
    return plan_result


def convert_route(routes):
    result = []
    for r in routes:
        temp = {
            "startLocation": r.start,
            "endLocation": r.end,
            "buyTransactions": convert_transactions(r.buy),
            "sellTransactions": convert_transactions(r.sell)
        }
        result.append(temp)
    return result


@app.errorhandler(BadRequestException)
def handle_bad_request(arg):
    return "Bad Request", 400


@app.route("/")
def serve_home_page():
    return send_from_directory("static", "index.html")


@app.route("/locations")
def retrieve_locations():
    filter_regex = ".*"
    if "filter" in request.args:
        filter_regex = request.args["filter"]
    locs = get_valid_shops(filter_regex)
    return jsonify(locs)


@app.route("/commodities")
def retrieve_commodities():
    filter_regex = ".*"
    if "filter" in request.args:
        filter_regex = request.args["filter"]
    coms = get_valid_coms(filter_regex)
    return jsonify(coms)


@app.route("/<ops>/stocks", methods=["POST"])
def retrieve_stock(ops):
    result = {}
    try:
        stock_request = request.json
        for loc in stock_request:
            buy_idx = shop_buy_index[loc]
            sell_idx = shop_sell_index[loc]
            result[loc] = {}

            for com in stock_request[loc]:
                com_lookup = buy_idx
                if ops == "buy":
                    pass
                elif ops == "sell":
                    com_lookup = sell_idx
                else:
                    raise BadRequestException

                shop_idx, com_idx = com_lookup[com]
                if ops == "buy":
                    result[loc][com] = shops[shop_idx].sells[com_idx].stock
                else:
                    result[loc][com] = shops[shop_idx].buys[com_idx].stock
        return jsonify(result)

    except (KeyError, ValueError):
        raise BadRequestException()


@app.route('/optimize', methods=["POST"])
def optimize():
    try:
        trade_info = request.json

        max_range = int(trade_info["max_range"])
        max_cargo = int(trade_info["max_cargo"])
        stops = int(trade_info["stops"])

        max_commodities = {}
        if "max_commodity" in trade_info:
            max_commodities = trade_info["max_commodity"]

        blk_locs = []
        if "blk_locations" in trade_info:
            blk_locs = trade_info["blk_locations"]

        restrictions = {}
        if "restrictions" in trade_info:
            restrictions = trade_info["restrictions"]

        filter_regex = r".*"
        if "filter" in trade_info:
            filter_regex = trade_info["filter"]
    except (KeyError, ValueError):
        raise BadRequestException()
    if max_range < 0:
        raise BadRequestException()

    plan, routes = get_solver(filter_regex)(max_cargo, stops, max_range, blk_locs, max_commodities, restrictions)

    final_map = {
        "plan": convert_plan(plan),
        "routes": convert_route(routes)
    }

    @after_this_request
    def add_header(response):
        response.cache_control.no_cache = True
        return response

    return jsonify(final_map)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
