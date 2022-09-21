package main

import (
	"encoding/json"
	"strings"
)

// UserGetData :
// Retrieve user's custom data.
// Returns empty object if not found
func UserGetData(c Core, gameID string, username string) (map[string]interface{}, error) {

	info := DataCreateInfo(username, "user_data")

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

// UserSetData : User - SetData
func UserSetData(c Core, gameID string, username string, data map[string]interface{}) error {

	info := DataCreateInfo(username, "user_data")

	return DataSave(c, gameID, info, data)
}

// UserGetKeyValue : User - GetKeyValue
func UserGetKeyValue(c Core, gameID string, username string, key string) (map[string]interface{}, error) {

	info := DataCreateInfo(username, "user_data")

	rawValue, err := DataLoadKey(c, gameID, info, key)
	if err != nil {
		return nil, err
	}

	output := make(map[string]interface{})
	if rawValue != (*string)(nil) {

		var data interface{}
		if err := json.Unmarshal([]byte(*rawValue), &data); err != nil {
			return nil, err
		}

		output[key] = data
	}

	return output, nil

}

// UserSetKeyValue : User - SetKeyValue
func UserSetKeyValue(c Core, gameID string, username string, key string, value interface{}) error {

	info := DataCreateInfo(username, "user_data")

	return DataSaveKey(c, gameID, info, key, value)
}

// UserGetUserIDs : User - GetUserIDs
func UserGetUserIDs(c Core, gameID string, usernames []string) (map[string]*string, error) {

	infos := make([]*DataInfo, len(usernames))
	for index, username := range usernames {
		info := DataCreateInfo(username, "user_extra")
		infos[index] = info
	}

	rawDatas, err := DataLoadKeyMultiple(c, gameID, infos, "user_id")
	if err != nil {
		return nil, err
	}

	output := make(map[string]*string)
	for fullKey, rawData := range rawDatas {

		parts := strings.Split(fullKey, "|")
		username := parts[1]
		var data string
		err := json.Unmarshal([]byte(string(*rawData)), &data)
		if err != nil {
			// handle error
			continue
		}
		output[username] = &data
	}
	return output, nil
}

// UserGetUserID : User - GetUserID
func UserGetUserID(c Core, gameID string, username string) (*string, error) {

	info := DataCreateInfo(username, "user_extra")

	rawUserID, err := DataLoadKey(c, gameID, info, "user_id")
	if err != nil {
		return nil, err
	}

	output := ""
	if rawUserID == (*string)(nil) {

		return &output, nil
	}

	if err := json.Unmarshal([]byte(*rawUserID), &output); err != nil {
		return nil, err
	}

	return &output, nil
}

// UserSetUserID : User - SetUserID
func UserSetUserID(c Core, gameID string, username string, userID string) error {

	info := DataCreateInfo(username, "user_extra")

	return DataSaveKey(c, gameID, info, "user_id", userID)
}

//region Messages

// UserGetMessageIDs : User - PrepMessageIDs
func UserGetMessageIDs(c Core, gameID string, username string) ([]string, error) {

	info := DataCreateInfo(username, "user_extra")

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

// UserSetMessageIDs : User - SetMessageIDs
func UserSetMessageIDs(c Core, gameID string, username string, messageIDs []string) error {

	info := DataCreateInfo(username, "user_extra")

	return DataSaveKey(c, gameID, info, "message_ids", messageIDs)
}

// UserGetMessages : User - GetMessages
func UserGetMessages(c Core, gameID string, username string) (map[string]*Message, error) {

	messageIDs, err := UserGetMessageIDs(c, gameID, username)
	if err != nil {
		return nil, err
	}

	return MessageGetMessages(c, gameID, messageIDs)
}

// UserDeleteMessages :  User - DeleteMessages
func UserDeleteMessages(c Core, gameID string, username string, messageIDs []string) error {
	newMessageIDs, err := UserGetMessageIDs(c, gameID, username)
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
		return UserSetMessageIDs(c, gameID, username, newMessageIDs)
	}

	return nil
}

// UserAddMessages :  User - AddMessages
func UserAddMessages(c Core, gameID string, username string, messageIDs []string) error {

	newMessageIDs, err := UserGetMessageIDs(c, gameID, username)
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
		return UserSetMessageIDs(c, gameID, username, newMessageIDs)
	}
	return nil
}

//endregion

//region Matches

// UserGetMatchIDs : User - PrepMatchIDs
func UserGetMatchIDs(c Core, gameID string, username string) ([]string, error) {

	info := DataCreateInfo(username, "user_extra")

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

// UserSetMatchIDs : User - SetMatchIDs
func UserSetMatchIDs(c Core, gameID string, username string, matchIDs []string) error {

	info := DataCreateInfo(username, "user_extra")

	return DataSaveKey(c, gameID, info, "match_ids", matchIDs)
}

// UserGetMatches : User - GetMatches
func UserGetMatches(c Core, gameID string, username string) (map[string]*Match, error) {

	matchIDs, err := UserGetMatchIDs(c, gameID, username)
	if err != nil {
		return nil, err
	}

	return MatchGetMatches(c, gameID, matchIDs)

}

// UserDeleteMatches :  User - DeleteMatches
func UserDeleteMatches(c Core, gameID string, username string, matchIDs []string) error {
	newMatchIDs, err := UserGetMatchIDs(c, gameID, username)
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
		return UserSetMatchIDs(c, gameID, username, newMatchIDs)
	}

	return nil
}

// UserAddMatches :  User - AddMatches
func UserAddMatches(c Core, gameID string, username string, matchIDs []string) error {
	newMatchIDs, err := UserGetMatchIDs(c, gameID, username)
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
		return UserSetMatchIDs(c, gameID, username, newMatchIDs)
	}

	return nil
}

//endregion

//region Pushes

// UserGetPushIDs : User - PrepPushIDs
func UserGetPushIDs(c Core, gameID string, username string) ([]string, error) {

	info := DataCreateInfo(username, "user_extra")

	rawPushIDs, err := DataLoadKey(c, gameID, info, "push_ids")
	if err != nil {
		return nil, err
	}

	if rawPushIDs != (*string)(nil) {

		var pushIDs []string
		if err := json.Unmarshal([]byte(*rawPushIDs), &pushIDs); err != nil {
			return nil, err
		}

		return pushIDs, nil
	}

	return []string{}, nil
}

// UserSetPushIDs : User - SetPushIDs
func UserSetPushIDs(c Core, gameID string, username string, pushIDs []string) error {

	info := DataCreateInfo(username, "user_extra")

	return DataSaveKey(c, gameID, info, "push_ids", pushIDs)
}

// UserGetPushes : User - GetPushes
func UserGetPushes(c Core, gameID string, username string) (map[string]*Push, error) {

	pushIDs, err := UserGetPushIDs(c, gameID, username)
	if err != nil {
		return nil, err
	}

	return PushGetPushes(c, gameID, pushIDs)

}

// UserDeletePushes :  User - DeletePushes
func UserDeletePushes(c Core, gameID string, username string, pushIDs []string) error {
	newPushIDs, err := UserGetPushIDs(c, gameID, username)
	if err != nil {
		return err
	}

	isChanged := false
	for _, pushID := range pushIDs {
		pushIndex := IndexValue(newPushIDs, pushID)
		if pushIndex >= 0 {
			if pushIndex < len(newPushIDs)-1 {
				newPushIDs = append(newPushIDs[:pushIndex], newPushIDs[pushIndex+1:]...)
			} else {
				newPushIDs = newPushIDs[:pushIndex]
			}
			isChanged = true
		}
	}

	if isChanged {
		return UserSetPushIDs(c, gameID, username, newPushIDs)
	}

	return nil
}

// UserAddPushes :  User - AddPushes
func UserAddPushes(c Core, gameID string, username string, pushIDs []string) error {
	newPushIDs, err := UserGetPushIDs(c, gameID, username)
	if err != nil {
		return err
	}

	isChanged := false
	for _, pushID := range pushIDs {
		pushIndex := IndexValue(newPushIDs, pushID)
		if pushIndex < 0 {
			newPushIDs = append(newPushIDs, pushID)
			isChanged = true
		}

	}

	if isChanged {
		return UserSetPushIDs(c, gameID, username, newPushIDs)
	}

	return nil
}

//endregion
