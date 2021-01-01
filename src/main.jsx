import ReactDOM from 'react-dom'
import * as React from 'react'
import document from 'global/document'
import { styled } from '@linaria/react'

const Section = styled.div`
    color: green;
`

const App = (<Section>
Hello, world!
</Section>)


ReactDOM.render(App, document.getElementById('root'))
