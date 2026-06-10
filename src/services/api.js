import useWebSocket from 'react-use-websocket';

const API_URL = '/api/'
const WS_URL = '/ws'

export const useCustomWebSocket = () => {
    const { lastJsonMessage } = useWebSocket(WS_URL, {
        onOpen: () => console.log('Соединение установлено'),
        shouldReconnect: () => true,
    });

    return lastJsonMessage;
};

async function get(path, setData) {
    await fetch(`${API_URL}${path}`)
        .then(res => res.json())
        .then(data => setData(data));
}

async function save(path, data) {
    const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    return response.json();
};



export async function getSettings(setData) {
    await get('settings', setData)
}

export async function getRelease(setData) {
    await get('release', setData)
};

export async function getData(setData) {
    await get('data', setData)
};

export async function getScore(setData) {
    await get('score', setData)
};



export async function saveData(newData) {
  return await save('data', newData)
}

export async function saveSettings(newData) {
  return await save('settings', newData)
}

export async function saveRelease(newData) {
  return await save('release', newData)
}

export async function saveScore(newData) {
  return await save('score', newData)
}


// WebSocket для слушания клиентскими страничками
export class WebSocketService {
  constructor(url = 'ws://localhost:3003') {
    this.url = url;
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  // Подключиться к серверу
  connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.emit('connected');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Получено сообщение:', message);
          this.emit('message', message);
          this.emit(message.type, message.data);
        } catch (e) {
          console.log('Получено сообщение:', event.data, e);
        }
      };
      
      // this.ws.onclose = () => {
      //   this.emit('disconnected');
      //   this.reconnect();
      // };
      
      // this.ws.onerror = (error) => {
      //   console.error('WebSocket ошибка:', error);
      //   this.emit('error', error);
      // };
    } catch (error) {
      console.error('Ошибка подключения:', error);
    }
  }
  
  // Переподключение
  // reconnect() {
  //   if (this.reconnectAttempts < this.maxReconnectAttempts) {
  //     this.reconnectAttempts++;
  //     console.log(`🔄 Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
  //     setTimeout(() => this.connect(), 3000);
  //   }
  // }
  
  // Отправить сообщение на сервер
  send(type, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, ...data });
      this.ws.send(message);
      console.log('📤 Отправлено:', message);
    } else {
      console.warn('WebSocket не подключен, сообщение не отправлено');
    }
  }
  
  // Подписаться на событие
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    
    // Возвращаем функцию отписки
    return () => this.off(event, callback);
  }
  
  // Отписаться от события
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }
  
  // Вызвать события
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Ошибка в обработчике ${event}:`, e);
        }
      });
    }
  }
  
  // Отключиться
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  // Статус подключения
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Создаем единственный экземпляр для всего приложения
export const wsService = new WebSocketService();