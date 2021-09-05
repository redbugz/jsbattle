import React from "react";
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {setSimQuality, setSimSpeed} from '../actions/coreAction.js';
import Loading from '../components/Loading.js';
import ProfileButton from '../components/ProfileButton.js';

export class Navi extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      console.log('Route changed: ' + this.props.location.pathname);
    }
  }

  speedToName(speed) {
    let label;
    if(speed < 0.1) label = "Super Slow";
    else if(speed < 1) label = "Slow";
    else if(speed == 1) label = "Normal";
    else if(speed < 3) label = "Fast";
    else label = "Super Fast";
    return label;
  }

  qualityToName(q) {
    if(q == 'auto') return 'Auto';
    let label;
    if(q < 0.33) label = "Low";
    else if(q < 0.66) label = "Normal";
    else label = "High";
    return label;
  }

  renderSpeedButton(speed) {
    let label = this.speedToName(speed);
    let classNames = "clickable dropdown-item sim-speed-" + String(speed).replace(".", "_");
    return <span className={classNames} onClick={() => this.props.setSimSpeed(speed)}>{label} Speed</span>;
  }

  renderQualityButton(q) {
    let label = this.qualityToName(q);
    let classNames = "clickable dropdown-item sim-quality-" + String(q).replace(".", "_");
    return <span className={classNames} onClick={() => this.props.setSimQuality(q)}>{label} Quality</span>;
  }

  renderControls() {
    let activeClasses = "nav-link main-nav-link active";
    let inactiveClasses = "nav-link main-nav-link";
    let pathname = this.props.location.pathname;
    let loading = null;
    if(this.props.isLoading) {
      loading = <Loading label="" />;
    }
    return <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <a
            className={pathname.startsWith('/challenge') ? activeClasses : inactiveClasses}
            href="#/challenge">
            <i className="fas fa-flask" aria-hidden="true"></i> Challenges
          </a>
        </li>
        <li className="nav-item">
          <a
            className={pathname.startsWith('/sandbox') ? activeClasses : inactiveClasses}
            href="#/sandbox">
            <i className="fas fa-drafting-compass" aria-hidden="true"></i> Sandbox
          </a>
        </li>
        <li className="nav-item">
          <a
            className={pathname.startsWith('/league') ? activeClasses : inactiveClasses}
            href="#/league">
            <i className="fas fa-trophy" aria-hidden="true"></i> League
          </a>
        </li>
        <li className="nav-item">
          <a className={inactiveClasses} href="./docs" target="_blank">
            <i className="far fa-file-alt" aria-hidden="true"></i> Docs
          </a>
        </li>
      </ul>
      <ul className="nav navbar-nav navbar-right">
        <li className="nav-item">
          <span className="nav-link main-nav-link" style={{fontWeight: 'normal'}}>{loading}</span>
        </li>
        <li className="dropdown">
          <span className="clickable dropdown-toggle sim-quality-button nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fas fa-image"></i> {this.qualityToName(this.props.simQuality)} <span className="caret"></span></span>
          <div className="nav-item dropdown-menu">
            {this.renderQualityButton('auto')}
            <span role="separator" className="dropdown-divider"></span>
            {this.renderQualityButton(0.0)}
            {this.renderQualityButton(0.5)}
            {this.renderQualityButton(1.0)}
          </div>
        </li>
        <li className="nav-item dropdown">
          <span className="clickable dropdown-toggle sim-speed-button nav-link" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fas fa-tachometer-alt"></i> {this.speedToName(this.props.simSpeed)} <span className="caret"></span></span>
          <div className="dropdown-menu dropdown-menu-right">
            {this.renderSpeedButton(0.05)}
            {this.renderSpeedButton(0.3)}
            {this.renderSpeedButton(1)}
            {this.renderSpeedButton(2)}
            {this.renderSpeedButton(50)}
          </div>
        </li>
        <ProfileButton
          logoutUrl={'/auth/logout'}
          role={this.props.role}
          username={this.props.profile ? this.props.profile.displayName : ''}
        />
      </ul>
    </div>;
  }

  render() {
    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-controls="bs-example-navbar-collapse-1" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <a className="navbar-brand" href="http://jsbattle.jmrlab.com" style={{borderRight: '1px solid #888', paddingRight: '15px'}}>
          <img src="./img/logo.png" alt="JsBattle" />
        </a>
        {this.renderControls()}
    </nav>;
  }
}

const mapStateToProps = (state) => ({
  profile: state.auth.profile,
  role: state.auth.profile ? (state.auth.profile.role || 'guest') : 'guest',
  simQuality: state.settings.simQuality,
  simSpeed: state.settings.simSpeed,
  isLoading: state.loading.SET_SIM_SPEED || state.loading.SET_SIM_QUALITY || state.loading.SETTINGS,
});

const mapDispatchToProps = (dispatch) => ({
  setSimSpeed: (speed) => {
    dispatch(setSimSpeed(speed));
  },
  setSimQuality: (quality) => {
    dispatch(setSimQuality(quality));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navi));
