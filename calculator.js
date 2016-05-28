'use strict'
var StateMachine = require('javascript-state-machine');

function Calculator() {
    function calculator() {
        this.current = '';
        this.memory = '';

        this.fsm = StateMachine.create({
            initial: 'updateFirst',
            events: [
              { name: 'number', from: ['updateFirst','appendFirst'], to: 'appendFirst' },
              { name: 'symbol', from: 'appendFirst', to: 'updateSecond' },
              { name: 'number', from: ['updateSecond','appendSecond'], to: 'appendSecond' }
            ]
        });
    }

    calculator.prototype.addNumber = function (value) {
        if (this.fsm.current.startsWith('update')) {
            this.current = String(value);
        } else if (this.fsm.current.startsWith('append')) {
            this.current += String(value);
        }
        this.fsm.number();
    };


    calculator.prototype.addComma = function () {
        if (this.current.length > 0
            && this.current.indexOf(',') == -1
            && this.fsm.current.startsWith('append')) {
            this.current += ',';
        }
    };

    calculator.prototype.addSymbol = function (value) {
        if (this.fsm.is('appendFirst')) {
            this.memory = this.current + " " + value;
        }
        this.fsm.symbol();
    };

    calculator.prototype.submit = function() {
        if (this.fsm.is('appendSecond')) {
            this.memory += (" " + this.current);
            this.current = String(eval(this.memory));
        }
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
        default:
          throw new Error('Unknown entry ' + i);
      }
    };

    return calculator;
}

module.exports = Calculator();
