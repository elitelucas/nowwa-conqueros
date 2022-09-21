package main

import (
	"encoding/json"
)

// ContextGetData :
// Retrieve context's custom data.
// Returns empty object if not found
func ContextGetData(c Core, gameID string, contextID string) (map[string]interface{}, error) {

	info := DataCreateInfo(contextID, "context_data")

	dataString, err := DataLoad(c, gameID, info)
	if err != nil {
		return nil, err
	}
	if dataString == (*string)(nil) {
		return make(map[string]interface{}), nil
	}

	var output map[string]interface{}
	if err := json.Unmarshal([]byte(*dataString), &output); err != nil {
		return nil, err
	}

	return output, nil
}

// ContextSetData : Context - SetData
func ContextSetData(c Core, gameID string, contextID string, data map[string]interface{}) error {

	info := DataCreateInfo(contextID, "context_data")

	return DataSave(c, gameID, info, data)
}

// ContextDeleteData : Context - DeleteData
func ContextDeleteData(c Core, gameID string, contextID string) error {

	info := DataCreateInfo(contextID, "context_data")

	return DataDelete(c, gameID, info)
}

// ContextGetKeyValue : Context - GetKeyValue
func ContextGetKeyValue(c Core, gameID string, contextID string, key string) (map[string]interface{}, error) {

	info := DataCreateInfo(contextID, "context_data")

	ptrValue, err := DataLoadKey(c, gameID, info, key)
	if err != nil {
		return nil, err
	}

	output := make(map[string]interface{})
	if ptrValue != (*string)(nil) {

		var data interface{}
		if err := json.Unmarshal([]byte(*ptrValue), &data); err != nil {
			return nil, err
		}

		output[key] = data
	}

	return output, nil

}

// ContextSetKeyValue : Context - SetKeyValue
func ContextSetKeyValue(c Core, gameID string, contextID string, key string, value interface{}) error {

	info := DataCreateInfo(contextID, "context_data")

	return DataSaveKey(c, gameID, info, key, value)
}

// ContextGetMessageIDs : Context - ProcessContextMessages
func ContextGetMessageIDs(c Core, gameID string, contextID string) ([]string, error) {

	info := DataCreateInfo(contextID, "context_extra")

	rawMessageIDs, err := DataLoadKey(c, gameID, info, "message_ids")
	if err != nil {
		return nil, err
	}

	if rawMessageIDs != (*string)(nil) {

		var messageIDs []string
		if err := json.Unmarshal([]byte(*rawMessageIDs), &messageIDs); err != nil {
			return nil, err
		}

		return messageIDs, nil
	}

	return []string{}, nil
}

// ContextSetMessageIDs : Context - SetMessageIDs
func ContextSetMessageIDs(c Core, gameID string, contextID string, messageIDs []string) error {

	info := DataCreateInfo(contextID, "context_extra")

	return DataSaveKey(c, gameID, info, "message_ids", messageIDs)
}

// ContextGetMessages : Context - GetMessages
func ContextGetMessages(c Core, gameID string, contextID string) (map[string]*Message, error) {

	messageIDs, err := ContextGetMessageIDs(c, gameID, contextID)
	if err != nil {
		return nil, err
	}

	return MessageGetMessages(c, gameID, messageIDs)

}

// ContextDeleteMessages :  Context - DeleteMessages
func ContextDeleteMessages(c Core, gameID string, contextID string, messageIDs []string) error {
	newMessageIDs, err := ContextGetMessageIDs(c, gameID, contextID)
	if err != nil {
		return err
	}

	isChanged := false
	for _, messageID := range messageIDs {
		messageIndex := IndexValue(newMessageIDs, messageID)
		if messageIndex >= 0 {
			if messageIndex < len(newMessageIDs)-1 {
				newMessageIDs = append(newMessageIDs[:messageIndex], newMessageIDs[messageIndex+1:]...)
			} else {
				newMessageIDs = newMessageIDs[:messageIndex]
			}
			isChanged = true
		}
	}

	if isChanged {
		return ContextSetMessageIDs(c, gameID, contextID, newMessageIDs)
	}

	return nil
}

// ContextAddMessages :  Context - AddMessages
func ContextAddMessages(c Core, gameID string, contextID string, messageIDs []string) error {

	newMessageIDs, err := ContextGetMessageIDs(c, gameID, contextID)
	if err != nil {
		return err
	}

	isChanged := false
	for _, messageID := range messageIDs {
		messageIndex := IndexValue(newMessageIDs, messageID)
		if messageIndex < 0 {
			newMessageIDs = append(newMessageIDs, messageID)
			isChanged = true
		}
	}

	if isChanged {
		return ContextSetMessageIDs(c, gameID, contextID, newMessageIDs)
	}

	return nil
}

// ContextGetMatchIDs : Context - PrepMatchIDs
func ContextGetMatchIDs(c Core, gameID string, contextID string) ([]string, error) {

	info := DataCreateInfo(contextID, "context_extra")

	rawMatchIDs, err := DataLoadKey(c, gameID, info, "match_ids")
	if err != nil {
		return nil, err
	}

	if rawMatchIDs != (*string)(nil) {

		var matchIDs []string
		if err := json.Unmarshal([]byte(*rawMatchIDs), &matchIDs); err != nil {
			return nil, err
		}

		return matchIDs, nil
	}

	return []string{}, nil
}

// ContextSetMatchIDs : Context - SetMatchIDs
func ContextSetMatchIDs(c Core, gameID string, contextID string, matchIDs []string) error {

	info := DataCreateInfo(contextID, "context_extra")

	return DataSaveKey(c, gameID, info, "match_ids", matchIDs)
}

// ContextGetMatches : Context - GetMatches
func ContextGetMatches(c Core, gameID string, contextID string) (map[string]*Match, error) {

	matchIDs, err := ContextGetMatchIDs(c, gameID, contextID)
	if err != nil {
		return nil, err
	}

	return MatchGetMatches(c, gameID, matchIDs)

}

// ContextDeleteMatches :  Context - DeleteMatches
func ContextDeleteMatches(c Core, gameID string, contextID string, matchIDs []string) error {
	newMatchIDs, err := ContextGetMatchIDs(c, gameID, contextID)
	if err != nil {
		return err
	}

	isChanged := false
	for _, matchID := range matchIDs {
		matchIndex := IndexValue(newMatchIDs, matchID)
		if matchIndex >= 0 {
			if matchIndex < len(newMatchIDs)-1 {
				newMatchIDs = append(newMatchIDs[:matchIndex], newMatchIDs[matchIndex+1:]...)
			} else {
				newMatchIDs = newMatchIDs[:matchIndex]
			}
			isChanged = true
		}
	}

	if isChanged {
		return ContextSetMatchIDs(c, gameID, contextID, newMatchIDs)
	}

	return nil
}

// ContextAddMatches :  Context - AddMatches
func ContextAddMatches(c Core, gameID string, contextID string, matchIDs []string) error {
	newMatchIDs, err := ContextGetMatchIDs(c, gameID, contextID)
	if err != nil {
		return err
	}

	isChanged := false
	for _, matchID := range matchIDs {
		matchIndex := IndexValue(newMatchIDs, matchID)
		if matchIndex < 0 {
			newMatchIDs = append(newMatchIDs, matchID)
			isChanged = true
		}
	}

	if isChanged {
		return ContextSetMatchIDs(c, gameID, contextID, newMatchIDs)
	}

	return nil
}
