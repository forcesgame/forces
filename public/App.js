"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _templateObject;

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function graphQLFetch(_x) {
  return _graphQLFetch.apply(this, arguments);
}
/**
 * Parent maintains state of all the users. State is initialized from the
 * server.
 */


function _graphQLFetch() {
  _graphQLFetch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(query) {
    var variables,
        response,
        result,
        error,
        details,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            variables = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            _context3.prev = 1;
            _context3.next = 4;
            return fetch('/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: query,
                variables: variables
              })
            });

          case 4:
            response = _context3.sent;
            _context3.next = 7;
            return response.json();

          case 7:
            result = _context3.sent;

            if (result.errors) {
              error = result.errors[0];

              if (error.extensions.code === 'BAD_USER_INPUT') {
                details = error.extensions.exception.errors.join('\n ');
                alert("".concat(error.message, ":\n ").concat(details));
              } else {
                alert(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ": ", ""])), error.extensions.code, error.message);
              }
            }

            return _context3.abrupt("return", result.data);

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](1);
            alert("Error sending data to server: ".concat(_context3.t0.message));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 12]]);
  }));
  return _graphQLFetch.apply(this, arguments);
}

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
                query = "\n      query {\n        getUsers {\n          userID\n          username\n          email\n        }\n      }";
                _context.next = 3;
                return graphQLFetch(query);

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
                query = "\n      mutation registerUser($user: UserInputs!) {\n        registerUser(user: $user) {\n          userID\n        }\n      }";
                _context2.next = 3;
                return graphQLFetch(query, {
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

      function registerUser(_x2) {
        return _registerUser.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, null), /*#__PURE__*/React.createElement(UserTable, {
        users: this.state.users
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
      var users = this.props.users;
      var userRows = users.map(function (user) {
        return /*#__PURE__*/React.createElement(UserRow, {
          key: user.userID,
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
      return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, user.userID), /*#__PURE__*/React.createElement("td", null, user.username), /*#__PURE__*/React.createElement("td", null, user.email));
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
  } // TODO hash passwords


  _createClass(RegisterForm, [{
    key: "handleSubmission",
    value: function handleSubmission(e) {
      e.preventDefault();
      var form = document.forms.registerUser;
      var user = {
        email: form.email.value,
        username: form.username.value,
        password: form.password.value
      };
      this.props.registerUser(user); // reset form; in the future, this will be unnecessary as user should be
      // redirected (maybe to home page) after registration (implicit auth?)

      form.email.value = "";
      form.username.value = "";
      form.password.value = "";
    }
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
      }), /*#__PURE__*/React.createElement("button", null, "register"));
    }
  }]);

  return RegisterForm;
}(React.Component);

var element = /*#__PURE__*/React.createElement(Parent, null);
ReactDOM.render(element, document.getElementById('content'));