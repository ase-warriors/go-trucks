/* eslint-env browser */
const React = require('react');
const {
  Tooltip, OverlayTrigger, Well, Button, FormGroup, FormControl, ControlLabel,
} = require('react-bootstrap');

const d3 = require('d3');
const PlacesWithStandaloneSearchBox = require('./searchbox.jsx');
const CurrentMap = require('./vendor_map.jsx');

function FieldGroup(props) {
  const {
    id, type, label, placeholder, onChange,
  } = props;
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl type={type} placeholder={placeholder} onChange={onChange} />
    </FormGroup>);
}

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      location: '',
      lng: -73.9625727,
      lat: 40.8075355,
      time: '',
      post: null,
      menu: '',
    }; // defaults to Columbia
    this.handleChange = this.handleChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.notifyCoordinates = this.notifyCoordinates.bind(this);
    this.notifyCoordinatesFromMap = this.notifyCoordinatesFromMap.bind(this);
  }
  componentDidMount() {
    this.getPosts();
    this.getProfile();
  }
  onClickSubmit(event) {
    d3.request(`/vendor/${this.props.vendorID}/post`)
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .header('Authorization', this.props.token)
      .post(`location=${this.state.location}&time=${this.state.time}&lat=${this.state.lat}&lng=${this.state.lng}&menu=${this.state.menu}`, (res) => {
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage.status === 'success') {
          window.alert('Post Successful!');
          this.getPosts();
          this.getProfile();
        } else {
          window.alert('Post Failed!');
        }
      });
    event.preventDefault();
  }

  getProfile() {
    d3.request(`/vendor/${this.props.vendorID}`)
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .header('Authorization', this.props.token)
      .get((res) => {
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage) {
          this.setState({
            profile: parsedMessage,
          });
        } else {
          console.log('get posts failed');
        }
      });
  }
  getPosts() {
    d3.request(`/vendor/${this.props.vendorID}/post`)
      .header('X-Requested-With', 'XMLHttpRequest')
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .header('Authorization', this.props.token)
      .get((res) => {
        const parsedMessage = JSON.parse(res.response);
        if (parsedMessage && parsedMessage.length > 0) {
          this.setState({
            post: parsedMessage,
            lng: parsedMessage[0].lng,
            lat: parsedMessage[0].lat,
            menu: parsedMessage[0].menu,
          });
        } else {
          console.log('get posts failed');
        }
      });
  }

  getSelectedCoordinates() {
    if (this.state.lng === 0.0 && this.state.lat === 0.0) {
      return 'N/A';
    }
    return `(${this.state.lng.toFixed(3)},${this.state.lat.toFixed(3)})`;
  }

  notifyCoordinatesFromMap(flat, flng) {
    this.setState({
      lng: flng,
      lat: flat,
    });
  }


  notifyCoordinates(co) {
    const flat = parseFloat(co.geometry.location.lat());
    const flng = parseFloat(co.geometry.location.lng());
    this.setState({
      lng: flng,
      lat: flat,
      location: co.formatted_address,
    });
  }


  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  render() {
    const selectMap = (
      <CurrentMap
        centerLatitude={this.state.lat}
        centerLongitude={this.state.lng}
        draggable
        notifyCoordinatesFromMap={this.notifyCoordinatesFromMap}
      />
    );

    const hoverOverSubmit = (
      <Tooltip id="tooltip">
        <strong>Go ahead and post it!</strong>
      </Tooltip>
    );

    const formInstance = (
      <form onSubmit={this.onClickSubmit}>
        <FieldGroup
          id="time"
          label="Enter Schedule (expected hours)*"
          placeholder="e.g. 12pm to 5pm"
          onChange={this.handleChange}
        />
        <label className="control-label">Enter Posting Location</label>
        <div id="address-validation">
          <PlacesWithStandaloneSearchBox notifyCoordinates={this.notifyCoordinates} />
          {selectMap}
        </div>
        <FieldGroup
          id="menu"
          label="Enter Descriptions (special menu, etc.)"
          onChange={this.handleChange}
          placeholder={this.state.menu}
        />
        <FormGroup>
          <OverlayTrigger placement="top" overlay={hoverOverSubmit}>
            <Button type="submit" disabled={this.state.lng === 0.0 || this.state.time === ''}>
            Submit
            </Button>
          </OverlayTrigger>
        </FormGroup>
      </form>
    );
    let currentPost = (
      <Well>
        <p>Last Posting Location: N/A</p>
        <p>Last Posting Time: N/A</p>
        <p>Last Posting Menu: N/A</p>
      </Well>);

    if (this.state.post !== null && this.state.post.length > 0) {
      currentPost = (
        <Well>
          <h4>Last Posting Location</h4>
          <p>{this.state.post[0].location}</p>
          <h4>Last Posting Time</h4>
          <p>{this.state.post[0].time}</p>
          <h4>Last Posting Menu</h4>
          <p>{this.state.post[0].menu}</p>
        </Well>);
    }
    let profileBlock = null;
    let name = '';
    if (this.state.profile != null) {
      profileBlock = (
        <Well>
          <h4>Email</h4>
          <p>{this.state.profile.email}</p>
          <h4>Registered on</h4>
          <p>{this.state.profile.registered_on}</p>
        </Well>
      );
      [name] = this.state.profile;
    }

    return (
      <div className="Create">
        <h2>Hello <strong>{name}</strong>!</h2>
        {profileBlock}
        <h2>Current Posting</h2>
        <div id="current-posting">
          {currentPost}
        </div>
        <h2>Create Posting</h2>
        <div>{formInstance}</div>
      </div>
    );
  }
}

module.exports = Create;
