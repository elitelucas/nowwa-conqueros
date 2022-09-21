package main

import (
	"encoding/json"
	"strconv"
	"strings"
)

// Message : Detailed struct for message
type Message struct {
	Status    string      `json:"status"`
	Sender    string      `json:"sender"`
	Content   interface{} `json:"content"`
	Receivers []string    `json:"usernames"`
	ContextID string      `json:"context_id"`
}

// MessageGetMessages : Message - GetMessages
func MessageGetMessages(c Core, gameID string, messageIDs []string) (map[string]*Message, error) {

	if len(messageIDs) > 0 {
		infos := make([]*DataInfo, len(messageIDs))
		for index, messageID := range messageIDs {
			info := DataCreateInfo(messageID, "message_data")
			infos[index] = info
		}

		data, err := DataLoadMultiple(c, gameID, infos)
		if err != nil {
			return nil, err
		}

		output := make(map[string]*Message)
		for fullMessageID, rawMessage := range data {
			var message Message
			if err := json.Unmarshal([]byte(*rawMessage), &message); err != nil {
				// handle error
				continue
			}
			messageIDParts := strings.Split(fullMessageID, "|")
			messageID := messageIDParts[1]
			output[messageID] = &message
		}

		return output, nil
	}

	return map[string]*Message{}, nil
}

// MessageDeleteMessages : Message - DeleteMessages
func MessageDeleteMessages(c Core, gameID string, messageIDs []string) error {

	messages, err := MessageGetMessages(c, gameID, messageIDs)
	if err != nil {
		return err
	}

	for messageID, message := range messages {

		if len(message.ContextID) >= 0 {
			if err := ContextDeleteMessages(c, gameID, message.ContextID, []string{messageID}); err != nil {
				// handle error
			}
		}

		if len(message.Receivers) > 0 {
			for _, username := range message.Receivers {
				err := UserDeleteMessages(c, gameID, username, []string{messageID})
				if err != nil {
					// handle error
				}
			}
		}

	}

	infos := make([]*DataInfo, len(messageIDs))
	for index, messageID := range messageIDs {
		info := DataCreateInfo(messageID, "message_data")
		infos[index] = info
	}

	if err := DataDeleteMultiple(c, gameID, infos); err != nil {
		return err
	}

	return nil
}

// MessageUpdateMessage : Message - UpdateMessage
func MessageUpdateMessage(c Core, gameID string, message Message, messageID string) (*string, error) {

	newMessageID := messageID
	if len(messageID) == 0 {
		newMessageID = strconv.FormatInt(GetNowMillisecond(), 16)
	}

	messages, err := MessageGetMessages(c, gameID, []string{newMessageID})
	if err != nil {
		return nil, err
	}

	newMessage, ok := messages[newMessageID]
	if !ok {
		newMessage = &Message{}
	}

	if message.Content != nil {
		newMessage.Content = message.Content
	}
	if len(message.Sender) > 0 {
		newMessage.Sender = message.Sender
	}
	newMessage.Status = message.Status
	if len(message.Receivers) > 0 {
		newMessage.Receivers = message.Receivers
	}
	if len(message.ContextID) > 0 {
		newMessage.ContextID = message.ContextID
	}

	info := DataCreateInfo(newMessageID, "message_data")

	err = DataSave(c, gameID, info, *newMessage)
	if err != nil {
		return nil, err
	}

	if len(newMessage.Receivers) > 0 {
		for _, username := range newMessage.Receivers {
			UserAddMessages(c, gameID, username, []string{newMessageID})
		}
	}

	if len(newMessage.ContextID) > 0 {
		ContextAddMessages(c, gameID, newMessage.ContextID, []string{newMessageID})
	}

	return &newMessageID, nil
}
