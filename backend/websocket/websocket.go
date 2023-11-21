package websocket

import (
	"log"
	"sync"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

type WSServer struct {
	connections      map[string]map[*websocket.Conn]struct{}
	connectionsMutex sync.Mutex
}

func NewWSServer() *WSServer {
	return &WSServer{
		connections: make(map[string]map[*websocket.Conn]struct{}),
	}
}

type WsResponseData struct {
}

func (w *WSServer) HandleWS(c echo.Context) error {
	log.Println("hit handle ws")
	chatRoomId := c.Param("chat_room_id")

	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()

		log.Println("Connection to :", chatRoomId)

		w.connectionsMutex.Lock()
		if _, ok := w.connections[chatRoomId]; !ok {
			w.connections[chatRoomId] = make(map[*websocket.Conn]struct{})
		}

		w.connections[chatRoomId][ws] = struct{}{}
		w.connectionsMutex.Unlock()

		defer func() {
			w.connectionsMutex.Lock()
			delete(w.connections[chatRoomId], ws)
			if len(w.connections[chatRoomId]) == 0 {

				delete(w.connections, chatRoomId)
			}
			w.connectionsMutex.Unlock()

			log.Println("Connection lost: ", ws.RemoteAddr(), " on :", chatRoomId)
		}()

		for {
			var msg string

			if err := websocket.Message.Receive(ws, &msg); err != nil {
				log.Println("Ws error when receiving message: ", err)
				break
			}

			log.Println("From: ", ws.RemoteAddr(), " incoming message: ", msg, "for room: ", chatRoomId)

			w.Broadcast(chatRoomId, msg)
		}

	}).ServeHTTP(c.Response(), c.Request())

	return nil
}

func (w *WSServer) Broadcast(chatRoomId, msg string) {
	w.connectionsMutex.Lock()
	defer w.connectionsMutex.Unlock()

	if groupConnections, ok := w.connections[chatRoomId]; ok {
		for conn := range groupConnections {
			if err := websocket.Message.Send(conn, msg); err != nil {
				log.Println(err)
			}
		}
	}
}
