import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/index.js'
import Notification from './components/utils/Notification.jsx'
import NotificationListener from './components/utils/NotificationListener.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Notification />
      <NotificationListener />
      <App />
    </Provider>
  </StrictMode>,
)



