import React, { useEffect, useContext } from 'react'
import { NavBar } from '@components/NavBar'
import styled from 'styled-components'
import { NavigationContext } from '@components/Route'

const LayoutContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  margin-top: 72px;
`
const Container = styled.div`
  padding-left: 16px;
  padding-right: 16px;
`

const Layout = ({ children, ...props }) => {
  const [_, navigate] = useContext(NavigationContext)
  const isAuth = true

  useEffect(() => {
    if (!isAuth) {
      navigate('/login')
    }
  }, [isAuth])

  return (
    <>
      <NavBar />
      <Container>
        <LayoutContainer {...props}>{children}</LayoutContainer>
      </Container>
    </>
  )
}

export { Layout }
