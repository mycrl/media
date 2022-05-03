'use strict'

/**
 * 范围回调
 * 
 * @callback RangeHandler
 * @returns {number}
 */

/**
 * 控制回调
 * 
 * @callback ControllerHandler
 * @returns {void}
 */

/**
 * 仪表盘
 * 
 * @class
 */
class Dashboard {
    
    /**
     * @constructor
     */
    constructor() {
        this._roll  = document.querySelector('#roll .error')
        this._pitch = document.querySelector('#pitch .error')
        this._yaw   = document.querySelector('#yaw .error')
        this._x     = document.querySelector('#x-range div')
        this._y     = document.querySelector('#y-range div')
        this._z     = document.querySelector('#z-range div')
        this._rate  = document.querySelector('#rate .rate')
    }
    
    /**
     * 获取角度或者速度
     * 
     * @param {HTMLElement} node
     * @return {Number}
     * @private
     */
    _getRange(node) {
        const s_range = node.innerText
        return Number(s_range.replace(/°|\s|m\/s|m/g, ''))
    }
    
    /**
     * 获取角度或者速度
     * 
     * @property {number}
     * @public
     */
    get roll() { return this._getRange(this._roll) }
    get pitch() { return this._getRange(this._pitch) }
    get yaw() { return this._getRange(this._yaw) }
    get x() { return this._getRange(this._x) }
    get y() { return this._getRange(this._y) }
    get z() { return this._getRange(this._z) }
    get rate() { return this._getRange(this._rate) }
}

/**
 * 控制器
 * 
 * @class
 */
class Controller {
    
    /**
     * @constructor
     */
    constructor() {
        this._roll_left     = document.getElementById('roll-left-button')
        this._roll_right    = document.getElementById('roll-right-button')
        this._pitch_up      = document.getElementById('pitch-up-button')
        this._pitch_down    = document.getElementById('pitch-down-button')
        this._yaw_left      = document.getElementById('yaw-left-button')
        this._yaw_right     = document.getElementById('yaw-right-button')
        this._forward       = document.getElementById('translate-forward-button')
        this._backward      = document.getElementById('translate-backward-button')
        this._axis_up       = document.getElementById('translate-up-button')
        this._axis_down     = document.getElementById('translate-down-button')
        this._axis_left     = document.getElementById('translate-left-button')
        this._axis_right    = document.getElementById('translate-right-button')
    }
    
    /**
     * 控制角度或者速度
     * 
     * @returns {void}
     * @public
     */
    rollLeft() { this._roll_left.click() }
    rollRight() { this._roll_right.click() }
    pitchUp() { this._pitch_up.click() }
    pitchDown() { this._pitch_down.click() }
    yawLeft() { this._yaw_left.click() }
    yawRight() { this._yaw_right.click() }
    forward() { this._forward.click() }
    backward() { this._backward.click() }
    axisUp() { this._axis_up.click() }
    axisDown() { this._axis_down.click() }
    axisLeft() { this._axis_left.click() }
    axisRight() { this._axis_right.click() }
}

/**
 * 安定面控制器
 * 
 * @desc 控制基本安定面
 * @class
 */
class Stabilizer {
    
    /**
     * @constructor
     */
    constructor() {
        this._range_hander = null
        this._high_hander = null
        this._low_hander = null
        this._offset = 0
    }
    
    /**
     * 获取范围
     * 
     * @param {RangeHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    range(hander) {
        this._range_hander = hander
        return this
    }
    
    /**
     * 拉低
     * 
     * @param {ControllerHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    low(hander) {
        this._low_hander = hander
        return this
    }
    
    /**
     * 拉高
     * 
     * @param {ControllerHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    high(hander) {
        this._high_hander = hander
        return this
    }
    
    /**
     * 主循环
     * 
     * @returns {void}
     * @public
     */
    poll() {
        const value = this._range_hander()
        if (value > 0.2) {
            if (this._offset <= 0) {
                this._high_hander()
                this._offset += 1
            }
        } else
        if (value < 0) {
            if (this._offset >= 0) {
                this._low_hander()
                this._offset -= 1
            }
        } else {
            if (this._offset < 0) {
                this._high_hander()
                this._offset += 1
            } else
            if (this._offset > 0) {
                this._low_hander()
                this._offset -= 1
            }
        }
    }
}

/**
 * 位置控制器
 * 
 * @class
 */
class Location {
     
    /**
     * @param {number} min
     * @param {number} max
     * @param {number} step
     * @constructor
     */
    constructor(step = 1, max = 0.2, min = 0) {
        this._range_hander = null
        this._high_hander = null
        this._low_hander = null
        this._range = null
        this._step = step
        this._max = max
        this._min = min
        this._rate = 0
    }
    
    /**
     * 计算速率
     * 
     * @returns {void}
     * @private
     */
    _compute_rate() {
        const range = this._range_hander()
        if (this._range == null) this._range = range
        this._rate = this._range > range ? 1 :
            (this._range < range ? -1 : 0)
        this._range = range
    }
    
    /**
     * 获取范围
     * 
     * @param {RangeHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    range(hander) {
        this._range_hander = hander
        return this
    }
    
    /**
     * 拉低
     * 
     * @param {ControllerHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    low(hander) {
        this._low_hander = hander
        return this
    }
     
    /**
     * 拉高
     * 
     * @param {ControllerHandler} handler
     * @returns {Stabilizer}
     * @public
     */
    high(hander) {
        this._high_hander = hander
        return this
    }
    
    /**
     * 主循环
     * 
     * @returns {void}
     * @public
     */
    poll() {
        this._compute_rate()
        if (this._range > this._max && this._rate <= 0)
            new Array(this._step).fill(null).forEach(() => this._low_hander())
        if (this._range < this._min && this._rate >= 0)
            new Array(this._step).fill(null).forEach(() => this._high_hander())
    }
}

const EDashboard = new Dashboard()
const EController = new Controller()

const Roll = new Stabilizer()
    .range(() => EDashboard.roll)
    .high(() => EController.rollRight())
    .low(() => EController.rollLeft())

const Pitch = new Stabilizer()
    .range(() => EDashboard.pitch)
    .high(() => EController.pitchDown())
    .low(() => EController.pitchUp())

const Yaw = new Stabilizer()
    .range(() => EDashboard.yaw)
    .high(() => EController.yawRight())
    .low(() => EController.yawLeft())

const X = new Location()
    .range(() => EDashboard.y)
    .high(() => EController.axisRight())
    .low(() => EController.axisLeft())

const Y = new Location()
    .range(() => EDashboard.z)
    .high(() => EController.axisUp())
    .low(() => EController.axisDown())

const Z = new Location(2, 0, -0.2)
    .range(() => EDashboard.rate)
    .high(() => EController.backward())
    .low(() => EController.forward())

setInterval(() => {
    Roll.poll()
    Pitch.poll()
    Yaw.poll()
    X.poll()
    Y.poll()
    Z.poll()
}, 1000)