import useWebSocket from 'react-use-websocket';

const useCustomWebSocket = () => {
    const { lastJsonMessage } = useWebSocket('ws://172.29.51.245:3003', {
        onOpen: () => console.log('Соединение установлено'),
        shouldReconnect: () => true,
    });

    return lastJsonMessage;
};

export default useCustomWebSocket;