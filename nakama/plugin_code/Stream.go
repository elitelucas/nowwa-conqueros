package main

import (
	"encoding/json"

	"github.com/heroiclabs/nakama-common/runtime"
)

// StreamRequest : Struct for join request
type StreamRequest struct {
	GameID string `json:"game_id"`
	Label  string `json:"label"`
}

// StreamData : Struct for stream data
type StreamData struct {
	Content interface{} `json:"content"`
	Sender  string      `json:"sender"`
}

// StreamResponse : Struct for join response
type StreamResponse struct {
	Stream    StreamRequest      `json:"stream"`
	Presences []runtime.Presence `json:"presences"`
}

// StreamJoin : Let user join a stream
func StreamJoin(c Core, userID string, sessionID string, req StreamRequest) (*StreamResponse, error) {

	var mode uint8
	mode = 123

	hidden := false
	persistence := false
	if _, err := c.nk.StreamUserJoin(mode, "", "", req.Label, userID, sessionID, hidden, persistence, ""); err != nil {
		return nil, err
	}

	notHidden := true
	presences, err := c.nk.StreamUserList(mode, "", "", req.Label, hidden, notHidden)
	if err != nil {
		return nil, err
	}

	response := StreamResponse{
		Presences: presences,
		Stream: StreamRequest{
			Label: req.Label,
		},
	}

	return &response, nil
}

// StreamLeave : Let user leave a stream
func StreamLeave(c Core, userID string, sessionID string, req StreamRequest) error {

	var mode uint8
	mode = 123
	if err := c.nk.StreamUserLeave(mode, "", "", req.Label, userID, sessionID); err != nil {
		return err
	}

	hidden := false
	notHidden := true
	presences, err := c.nk.StreamUserList(mode, "", "", req.Label, hidden, notHidden)
	if err != nil {
		return err
	}

	c.logger.Error("len(presences)", len(presences))

	if len(presences) == 0 {
		ContextDeleteData(c, req.GameID, req.Label)
		return nil
	}

	return nil
}

// StreamSendData : Let user send data to a stream
func StreamSendData(c Core, userID string, username string, sessionID string, req StreamRequest, data interface{}) error {

	var mode uint8
	mode = 123

	hidden := false
	persistence := false
	if _, err := c.nk.StreamUserJoin(mode, "", "", req.Label, userID, sessionID, hidden, persistence, ""); err != nil {
		return err
	}

	notHidden := true
	presences, err := c.nk.StreamUserList(mode, "", "", req.Label, hidden, notHidden)
	if err != nil {
		return err
	}

	streamData := StreamData{
		Sender:  username,
		Content: data,
	}

	rawData, err := json.Marshal(streamData)
	if err != nil {
		return err
	}

	reliable := true
	if err := c.nk.StreamSend(mode, "", "", req.Label, string(rawData), presences, reliable); err != nil {
		return err
	}

	return nil
}
