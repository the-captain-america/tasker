import React, { useState, useContext } from 'react'
import { Button } from '@common/Button'
import { Input } from '@common/Input'
import { NavigationContext } from '@components/Route'
import { Dropdown } from '@common/Dropdown'
import {
  CreateContainer,
  CreateWrapper,
  FormContainer,
} from './CreateForm.styled'

const filterActiveCategory = (category) => {
  const result = category.find((x) => {
    return x.active !== false
  })
  return result ? result.value : ''
}

const CreateForm = ({ callback, categories }) => {
  const [state, setState] = useState({
    label: '',
    date: '',
    details: '',
    category: categories,
  })
  const [_, navigate] = useContext(NavigationContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setState((state) => ({ ...state, [name]: value }))
  }

  const clearForm = () => {
    setState({
      label: '',
      date: '',
      details: '',
      category: [
        { label: 'Personal', active: false, value: 'personal' },
        { label: 'Work', active: false, value: 'work' },
      ],
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const resultOfCategory = filterActiveCategory(state.category)
    callback({ ...state, category: resultOfCategory })
    clearForm()
    navigate('/')
  }

  const handleCancel = (e) => {
    e.preventDefault()
    navigate('/')
  }

  const handleDropdown = (payload) => {
    const { name, value } = payload
    setState((state) => ({ ...state, [name]: value }))
  }

  return (
    <CreateWrapper className="create-wrapper">
      <CreateContainer>
        <FormContainer onSubmit={onSubmit}>
          <h3>Create Task</h3>
          <Input
            name="label"
            placeholder="task name"
            className="name"
            onChange={handleChange}
            value={state.label}
          />
          <Input
            name="date"
            type="date"
            placeholder="due date"
            className="date"
            onChange={handleChange}
            value={state.date}
          />
          <Input
            name="details"
            placeholder="details of task"
            className="detail"
            onChange={handleChange}
            value={state.details}
          />
          <Dropdown
            name="category"
            isMulti={false}
            callback={handleDropdown}
            options={state.category}
          />
          <Button className="save-button">Save</Button>
          <Button className="cancel-button" onClick={handleCancel}>
            Cancel
          </Button>
        </FormContainer>
      </CreateContainer>
    </CreateWrapper>
  )
}

export { CreateForm }