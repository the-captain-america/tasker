import React, { useState } from 'react'
import { NavBar } from './NavBar'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveItem, addItem, setFavItem } from '../../store'
import { updatedList, updatedFavouriteList, generateRandom } from './utils'
import Icon from '@common/Icon'
import {
  AppContainer,
  Content,
  List,
  TickContainer,
  StarContainer,
  Group,
  InputContainer,
  Header,
  TitleContainer,
  BackgroundTriangle,
  Wrapper,
} from './Tasker.styled'

const Title = () => {
  return (
    <TitleContainer>
      <h2>Groceries</h2>
    </TitleContainer>
  )
}

const HeaderContainer = () => {
  return (
    <Header className="header">
      <h2>To Do List</h2>
      <Icon name="STAR" />
    </Header>
  )
}

const Tasker = () => {
  const dispatch = useDispatch()
  const { items: options } = useSelector((state) => {
    return state.item
  })

  const [value, setValue] = useState('')

  const handleFavourite = (item) => {
    const payload = updatedFavouriteList(options, item)

    dispatch(setFavItem(payload))
  }

  const handleSelect = (itemSelected) => {
    const payload = updatedList(options, itemSelected)

    dispatch(setActiveItem(payload))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = [
      ...options,
      { label: value, id: generateRandom(), active: false, favourite: false },
    ]
    dispatch(addItem(payload))
    setValue('')
  }

  const renderList = () => {
    const result = options.map((item) => {
      return (
        <List key={item.id} isActive={item.active}>
          <TickContainer
            isActive={item.active}
            onClick={() => handleSelect(item)}
          >
            <Icon name="CHECKTICK" />
          </TickContainer>
          <span>{item.label}</span>
          <StarContainer
            isFav={item.favorite}
            onClick={() => handleFavourite(item)}
          >
            <Icon name="STAR" />
          </StarContainer>
        </List>
      )
    })
    return <Group>{result}</Group>
  }

  return (
    <Wrapper>
      <AppContainer className="app">
        <NavBar />
        <HeaderContainer className="header" />
        <Content className="content">
          <Title />
          <InputContainer>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Add item..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
          </InputContainer>
        </Content>
        {renderList()}
      </AppContainer>
      <BackgroundTriangle />
    </Wrapper>
  )
}

export default Tasker
