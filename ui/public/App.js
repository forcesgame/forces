"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _graphQLFetch = _interopRequireDefault(require("./graphQLFetch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Parent maintains state of all the users. State is initialized from the
 * server.
 */
var Parent = /*#__PURE__*/function (_React$Component) {
  _inherits(Parent, _React$Component);

  var _super = _createSuper(Parent);

  function Parent() {
    var _this;

    _classCallCheck(this, Parent);

    _this = _super.call(this);
    _this.state = {
      users: []
    };
    _this.registerUser = _this.registerUser.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Parent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadData();
    }
  }, {
    key: "loadData",
    value: function () {
      var _loadData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var query, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = "\n      query {\n        getUsers {\n          _id\n          username\n          email\n        }\n      }";
                _context.next = 3;
                return (0, _graphQLFetch.default)(query);

              case 3:
                data = _context.sent;

                if (data) {
                  this.setState({
                    users: data.getUsers
                  });
                }

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadData() {
        return _loadData.apply(this, arguments);
      }

      return loadData;
    }()
  }, {
    key: "registerUser",
    value: function () {
      var _registerUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
        var query, data;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = "\n      mutation registerUser($user: UserInputs!) {\n        registerUser(user: $user) {\n          _id\n        }\n      }";
                _context2.next = 3;
                return (0, _graphQLFetch.default)(query, {
                  user: user
                });

              case 3:
                data = _context2.sent;

                if (data) {
                  this.loadData();
                }

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function registerUser(_x) {
        return _registerUser.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: "render",
    value: function render() {
      var users = this.state.users;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, null), /*#__PURE__*/React.createElement(UserTable, {
        users: users
      }), /*#__PURE__*/React.createElement(RegisterForm, {
        registerUser: this.registerUser
      }));
    }
  }]);

  return Parent;
}(React.Component);

function Heading() {
  return /*#__PURE__*/React.createElement("h1", null, "forces");
}
/**
 * Receives user state via props from Parent
 */
// eslint-disable-next-line react/prefer-stateless-function


var UserTable = /*#__PURE__*/function (_React$Component2) {
  _inherits(UserTable, _React$Component2);

  var _super2 = _createSuper(UserTable);

  function UserTable() {
    _classCallCheck(this, UserTable);

    return _super2.apply(this, arguments);
  }

  _createClass(UserTable, [{
    key: "render",
    value: function render() {
      var users = this.props.users; // eslint-disable-next-line no-underscore-dangle

      var userRows = users.map(function (user) {
        return /*#__PURE__*/React.createElement(UserRow, {
          key: user._id,
          user: user
        });
      });
      return /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Username"), /*#__PURE__*/React.createElement("th", null, "Email"))), /*#__PURE__*/React.createElement("tbody", null, userRows));
    }
  }]);

  return UserTable;
}(React.Component);
/**
 * Receives user state via props from UserTable
 */
// eslint-disable-next-line react/prefer-stateless-function


var UserRow = /*#__PURE__*/function (_React$Component3) {
  _inherits(UserRow, _React$Component3);

  var _super3 = _createSuper(UserRow);

  function UserRow() {
    _classCallCheck(this, UserRow);

    return _super3.apply(this, arguments);
  }

  _createClass(UserRow, [{
    key: "render",
    value: function render() {
      var user = this.props.user;
      return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, user._id), /*#__PURE__*/React.createElement("td", null, user.username), /*#__PURE__*/React.createElement("td", null, user.email));
    }
  }]);

  return UserRow;
}(React.Component);

var RegisterForm = /*#__PURE__*/function (_React$Component4) {
  _inherits(RegisterForm, _React$Component4);

  var _super4 = _createSuper(RegisterForm);

  function RegisterForm() {
    var _this2;

    _classCallCheck(this, RegisterForm);

    _this2 = _super4.call(this);
    _this2.handleSubmission = _this2.handleSubmission.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(RegisterForm, [{
    key: "handleSubmission",
    value: function () {
      var _handleSubmission = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(e) {
        var form, user, registerUser;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                e.preventDefault();
                form = document.forms.registerUser;
                user = {
                  email: form.email.value,
                  username: form.username.value,
                  password: form.password.value
                };
                registerUser = this.props.registerUser;
                registerUser(user); // reset form; in the future, this will be unnecessary as user should be
                // redirected (maybe to home page) after registration (implicit auth?)

                form.email.value = '';
                form.username.value = '';
                form.password.value = '';

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function handleSubmission(_x2) {
        return _handleSubmission.apply(this, arguments);
      }

      return handleSubmission;
    }()
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("form", {
        name: "registerUser",
        onSubmit: this.handleSubmission
      }, /*#__PURE__*/React.createElement("input", {
        type: "email",
        name: "email",
        placeholder: "email"
      }), /*#__PURE__*/React.createElement("input", {
        type: "text",
        name: "username",
        placeholder: "username"
      }), /*#__PURE__*/React.createElement("input", {
        type: "password",
        name: "password",
        placeholder: "password"
      }), /*#__PURE__*/React.createElement("button", {
        type: "submit"
      }, "register"));
    }
  }]);

  return RegisterForm;
}(React.Component);

var element = /*#__PURE__*/React.createElement(Parent, null);
ReactDOM.render(element, document.getElementById('content'));