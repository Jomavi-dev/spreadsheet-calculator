import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { toast } from 'react-toastify'
import 'react-datepicker/dist/react-datepicker.css'

class EditExercise extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      description: '',
      duration: 0,
      date: new Date(),
      users: []
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:5000/api/v1/exercises/${this.props.match.params.id}`)
      .then(({ data }) => {
        this.setState({
          username: { value: data.username, label: data.username },
          description: data.description,
          duration: data.duration,
          date: new Date(data.date)
        })
      })
      .catch(err => console.log(err))

    axios.get('http://localhost:5000/api/v1/users/')
      .then(({ data }) => {
        if (data.length > 0) {
          this.setState({
            users: data.map(user => user.username)
          })
        }
      })
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({
      [name]: value
    })
  }

  handleDateChange = date => {
    this.setState({ date })
  }

  handleSelectChange = username => {
    this.setState({ username })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { username, description, duration, date } = this.state

    const exercise = {
      username: username.value,
      description: description,
      duration: duration,
      date: date,
    }
    axios.patch(`http://localhost:5000/api/v1/exercises/${this.props.match.params.id}`, exercise)
      .then(({ data }) => toast.success(data, { onClose: () => window.history.back(), toastId: 'deleteSuccessfulToast' }))
      .catch(err => toast.error(err, { autoClose: false }))
    // .then(res => console.log(res.data))
  }

  getOptions = () => {
    return this.state.users.map(user => {
      return ({
        value: user,
        label: user
      })
    })
  }

  render() {
    const { username, description, duration, date } = this.state

    return (
      <div className="container py-5">
        <h2 className="text-center mb-4 mx-4">Edit Exercise Log</h2>

        <form onSubmit={this.handleSubmit} className="container-form">
          <div className="form-group">
            <label>Username</label>
            <Select
              value={username}
              onChange={this.handleSelectChange}
              options={this.getOptions()}
              placeholder="Pick a username"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              required
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              value={description}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="duration" className="form-label">Duration (mins)</label>
            <input
              required
              type="number"
              min="5"
              id="duration"
              name="duration"
              value={duration}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <div>
              <DatePicker
                required
                selected={date}
                onChange={this.handleDateChange}
                className="form-control"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary form-control">Edit Exercise</button>
        </form>
      </div >
    )
  }
}

export default EditExercise