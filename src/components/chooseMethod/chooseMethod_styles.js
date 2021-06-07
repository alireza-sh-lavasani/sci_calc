import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Title = styled.p`
  font-size: 1.5em;
  margin-bottom: 1em;
  font-weight: bold;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`
