import { render } from "@testing-library/react";
import "./App.css";
import { Component, useState, useEffect } from "react";
import clockFace from './ClockFace.png';
import clockFace_H from './ClockFace_H.png';
import clockFace_M from './ClockFace_M.png';
import clockFace_S from './ClockFace_S.png';


const Spoiler = ({ header = "+", open, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  const toggleSpoiler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleSpoiler}>
      <div>{header}</div>
      {isOpen && children}
    </div>
  );
};

const RangeInput = ({ min, max }) => {
  const [inputValue, setInputValue] = useState(min);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const inputStyle = {
    backgroundColor: inputValue < min || inputValue > max ? "red" : "white",
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={inputValue}
      onChange={handleChange}
      style={inputStyle}
    />
  );
};

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const { login, password } = form;
    if (login && password) {
      onLogin(login, password);
    }
  };

  const isDisabled = !form.login && !form.password;

  return (
    <div>
      <input
        type="text"
        name="login"
        placeholder="Login"
        value={form.login}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit} disabled={isDisabled}>
        Login
      </button>
    </div>
  );
};

class PasswordConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirmPassword: "",
    };
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = (event) => {
    this.setState({ confirmPassword: event.target.value });
  };

  render() {
    const { password, confirmPassword } = this.state;
    const passwordsMatch = password === confirmPassword;

    return (
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={this.handleConfirmPasswordChange}
        />
        {!passwordsMatch && <p>Паролі не збігаються</p>}
      </div>
    );
  }
}

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: props.seconds,
      isPaused: false,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      if (!this.state.isPaused && this.state.seconds > 0) {
        this.setState((prevState) => ({
          seconds: prevState.seconds - 1
        }));
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handlePause = () => {
    this.setState((prevState) => ({
      isPaused: !prevState.isPaused
    }));
  };

  render() {
    const { seconds } = this.state;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return (
      <div>
        <div>
          <span>{hours < 10 ? '0' + hours : String(hours)}</span>:
          <span>{minutes < 10 ? '0' + minutes : String(minutes)}</span>:
          <span>{remainingSeconds < 10 ? '0' + remainingSeconds : String(remainingSeconds)}</span>
        </div>
        <button onClick={this.handlePause}>{this.state.isPaused ? 'Resume' : 'Pause'}</button>
      </div>
    );
  }
}

class TimerController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      timerStarted: false
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: parseInt(value, 10) });
  };

  handleStartTimer = () => {
    this.setState({ timerStarted: true });
  };

  render() {
    const { hours, minutes, seconds, timerStarted } = this.state;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    return (
      <div>
        <input
          type="number"
          name="hours"
          placeholder="Hours"
          value={hours}
          onChange={this.handleInputChange}
        />
        <input
          type="number"
          name="minutes"
          placeholder="Minutes"
          value={minutes}
          onChange={this.handleInputChange}
        />
        <input
          type="number"
          name="seconds"
          placeholder="Seconds"
          value={seconds}
          onChange={this.handleInputChange}
        />
        <button onClick={this.handleStartTimer} disabled={timerStarted}>
          Start
        </button>
        {timerStarted && <Timer seconds={totalSeconds} onStop={() => this.setState({ timerStarted: false })} />}
      </div>
    );
  }
}

const TimerContainer = ({ seconds, refresh, render: RenderComponent }) => {
  const [currentTime, setCurrentTime] = useState(seconds);

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(timerID);
          return 0;
        }
      });
    }, refresh);

    return () => {
      clearInterval(timerID);
    };
  }, [seconds, refresh]);

  return <RenderComponent seconds={currentTime} />;
};

const SecondsTimer = ({seconds}) => <h2>{seconds}</h2>

const Lcd = ({ seconds }) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div>
      <span>{hours < 10 ? '0' + hours : hours}</span>:
      <span>{minutes < 10 ? '0' + minutes : minutes}</span>:
      <span>{remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}</span>
    </div>
  );
};

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date()
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { time } = this.state;
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourRotation = (hours % 12) * 30 + minutes * 0.5;
    const minuteRotation = minutes * 6 + seconds * 0.1;
    const secondRotation = seconds * 6;

    return (
      <div className="clock">
        <img src={clockFace} alt="Clock Face" className="clock-face" />
        <img src={clockFace_H} alt="Hour Hand" className="hour-hand" style={{ transform: `rotate(${hourRotation}deg)` }} />
        <img src={clockFace_M} alt="Minute Hand" className="minute-hand" style={{ transform: `rotate(${minuteRotation}deg)` }} />
        <img src={clockFace_S} alt="Second Hand" className="second-hand" style={{ transform: `rotate(${secondRotation}deg)` }} />
      </div>
    );
  }
}


function App() {
  return (
    <div>
      <Spoiler header={<h1>Заголовок</h1>} open>
        Контент 1<p>Лорем ипсум траливали и тп.</p>
      </Spoiler>

      <Spoiler>
        <h2>Контент 2</h2>
        <p>Лорем ипсум траливали и тп.</p>
      </Spoiler>

      <RangeInput min={2} max={10} />
      <LoginForm />
      <PasswordConfirm />
      <Timer seconds={3600} />
      <TimerController/>
      <TimerContainer seconds={1800} refresh={1000} render={SecondsTimer} />
      <TimerContainer seconds={1800} refresh={1000} render={Lcd} />
      <Clock/>
    </div>
  );
}

export default App;
