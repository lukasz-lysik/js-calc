'use strict'
var StateMachine = require('javascript-state-machine');

function Calculator() {
    function calculator() {
        this.current = '0';
        this.memory = '';

        this.fsm = StateMachine.create({
            initial: 'first',
            events: [
              { name: 'number', from: 'first', to: 'first' },
              { name: 'number', from: ['symbol','second'], to: 'second' },
              { name: 'symbol', from: ['first', 'second', 'symbol'], to: 'symbol' }
            ]
        });
    }

    calculator.prototype.mainDisplay = function() {
      return this.current;
    };

    calculator.prototype.additionalDisplay = function() {
      return this.memory;
    };

    calculator.prototype.addNumber = function (value) {
        if(this.current == '0' || this.fsm.is('symbol')) {
          this.current = String(value);
        } else {
          this.current += String(value);
        }
        this.fsm.number(value);
    };

    calculator.prototype.addDecimalSeparator = function () {
        if (this.current.length > 0
            && this.current.indexOf('.') == -1) {
            this.current += '.';
        }
    };

    calculator.prototype.addSymbol = function (value) {
        if (this.fsm.is('first')) {
            var currentEvaluated = this.eval(this.current);
            this.memory += currentEvaluated + ' ' + value;
            this.current = String(currentEvaluated);
        } else if(this.fsm.is('symbol')) {
          this.memory = this.memory.substr(0, this.memory.length - 1) + value;
        } else if(this.fsm.is('second')) {
          var currentEvaluated = this.eval(this.current);
          this.current = this.eval(this.memory + this.current);
          this.memory += ' ' + currentEvaluated + ' ' + value;
        }
        this.fsm.symbol();
    };

    calculator.prototype.backspace = function() {
      if(!this.fsm.is('first') && !this.fsm.is('second'))
        return;
      if(this.current.length > 1) {
        this.current = this.current.substr(0, this.current.length - 1);
      } else if (this.current.length == 1) {
        this.current = '0';
      }
    };

    calculator.prototype.submit = function() {
        if (this.fsm.is('second')) {
            this.current = this.eval(this.memory + this.current);
            this.memory = '';
        }
    };

    calculator.prototype.clearEntry = function() {
      this.current = '0';
    }

    calculator.prototype.clear = function () {
      this.current = '0';
      this.memory = '';
    };

    calculator.prototype.input = function(i) {
      switch(i) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addNumber(i);
          break;
        case '.':
          this.addDecimalSeparator();
          break;
        case '=':
          this.submit();
          break;
        case '+':
        case '-':
        case '*':
        case '/':
          this.addSymbol(i);
          break;
        case '<-':
          this.backspace();
          break;
        case 'CE':
          this.clearEntry();
          break;
        case 'C':
          this.clear();
          break;
        default:
          throw new Error('Unknown entry ' + i);
      }
    };

    calculator.prototype.eval = function(expr) {
      return String(Number(eval(expr).toFixed(10)));
    }

    return calculator;
}

module.exports = Calculator();
