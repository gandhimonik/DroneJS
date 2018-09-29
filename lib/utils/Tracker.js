'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tracker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _universalAnalytics = require('universal-analytics');

var _universalAnalytics2 = _interopRequireDefault(_universalAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tracker = exports.Tracker = function () {
    function Tracker() {
        _classCallCheck(this, Tracker);

        this.track = (0, _universalAnalytics2.default)('UA-125923640-1');
        this.category = null;
    }

    _createClass(Tracker, [{
        key: 'report',
        value: function report(action) {
            this.track.event(this.category, action).send();
        }
    }, {
        key: 'setCategory',
        value: function setCategory(id) {
            this.category = id;
        }
    }]);

    return Tracker;
}();