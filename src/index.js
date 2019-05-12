import React from 'react'
import ReactDOM from 'react-dom'
import Message from './client/Message'

import './css/style.css'

ReactDOM.render(
  <Message />,
  document.getElementById('root') // eslint-disable-line no-undef
)

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  

