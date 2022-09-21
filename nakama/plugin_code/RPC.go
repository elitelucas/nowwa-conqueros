package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"math"
	"math/rand"
	"time"

	"github.com/heroiclabs/nakama-common/runtime"
)

// RPCGetData : RPC - GetData
func RPCGetData(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string `json:"game_id"`
		ContextID string `json:"context_id"`
		Username  string `json:"username"`
		Key       string `json:"key"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	var response interface{}
	var err error
	if len(input.Key) > 0 {
		if len(input.ContextID) > 0 {
			response, err = ContextGetKeyValue(c, input.GameID, input.ContextID, input.Key)
		} else {
			response, err = UserGetKeyValue(c, input.GameID, input.Username, input.Key)
		}
		if err != nil {
			return "", err
		}
	} else {
		if len(input.ContextID) > 0 {
			response, err = ContextGetData(c, input.GameID, input.ContextID)
		} else {
			response, err = UserGetData(c, input.GameID, input.Username)
		}
		if err != nil {
			return "", err
		}
	}

	bytesResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(bytesResponse), nil
}

// RPCSetData : RPC - SetData
func RPCSetData(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string                 `json:"game_id"`
		ContextID string                 `json:"context_id"`
		Username  string                 `json:"username"`
		Content   map[string]interface{} `json:"content"`
		Key       string                 `json:"key"`
		Value     interface{}            `json:"value"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	// logger.Info("set data: %v", input)

	c := Core{ctx, logger, db, nk}

	var err error
	if len(input.Key) > 0 {
		if len(input.ContextID) > 0 {
			err = ContextSetKeyValue(c, input.GameID, input.ContextID, input.Key, input.Value)
		} else {
			err = UserSetKeyValue(c, input.GameID, input.Username, input.Key, input.Value)
		}
		if err != nil {
			return "", err
		}
	} else {
		if len(input.ContextID) > 0 {
			err = ContextSetData(c, input.GameID, input.ContextID, input.Content)
		} else {
			err = UserSetData(c, input.GameID, input.Username, input.Content)
		}
		if err != nil {
			return "", err
		}
	}

	return "", nil
}

// RPCGetDataMultiple : RPC - GetDataMultiple
func RPCGetDataMultiple(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID     string   `json:"game_id"`
		ContextIDs []string `json:"context_ids"`
		Usernames  []string `json:"usernames"`
		Key        string   `json:"key"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	// logger.Info("get data: %v", input)

	c := Core{ctx, logger, db, nk}

	var infos []*DataInfo
	if len(input.ContextIDs) > 0 {
		infos = make([]*DataInfo, len(input.ContextIDs))
		for index, contextID := range input.ContextIDs {
			infos[index] = DataCreateInfo(contextID, "context_data")
		}
	} else {
		infos = make([]*DataInfo, len(input.Usernames))
		for index, username := range input.Usernames {
			infos[index] = DataCreateInfo(username, "user_data")
		}
	}

	var response interface{}
	var err error
	if len(input.Key) > 0 {
		response, err = DataLoadKeyMultiple(c, input.GameID, infos, input.Key)
		if err != nil {
			return "", err
		}
	} else {
		response, err = DataLoadMultiple(c, input.GameID, infos)
		if err != nil {
			return "", err
		}
	}

	bytesResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(bytesResponse), nil
}

// RPCGetMessages : RPC - GetMessages
func RPCGetMessages(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string `json:"game_id"`
		ContextID string `json:"context_id"`
		Username  string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}
	var response map[string]*Message
	var err error
	if len(input.ContextID) > 0 {
		response, err = ContextGetMessages(c, input.GameID, input.ContextID)

		if err != nil {
			return "", err
		}
	} else {
		response, err = UserGetMessages(c, input.GameID, input.Username)

		if err != nil {
			return "", err
		}
	}

	bytesResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(bytesResponse), nil
}

// RPCSendMessage : RPC - SendMessage
func RPCSendMessage(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string      `json:"game_id"`
		ContextID string      `json:"context_id"`
		MessageID string      `json:"message_id"`
		Status    string      `json:"status"`
		Sender    string      `json:"sender"`
		Content   interface{} `json:"content"`
		Receivers []string    `json:"usernames"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	message := Message{
		Status:  input.Status,
		Sender:  input.Sender,
		Content: input.Content,
	}
	if len(input.Receivers) > 0 {
		message.Receivers = input.Receivers
	} else {
		message.ContextID = input.ContextID
	}

	c := Core{ctx, logger, db, nk}
	messageID, err := MessageUpdateMessage(c, input.GameID, message, input.MessageID)

	output := map[string]string{
		"message_id": *messageID,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCUpdateMessage : RPC - UpdateMessage
func RPCUpdateMessage(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string      `json:"game_id"`
		MessageID string      `json:"message_id"`
		Status    string      `json:"status"`
		Sender    string      `json:"sender"`
		Content   interface{} `json:"content"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	message := Message{
		Status:  input.Status,
		Content: input.Content,
		Sender:  input.Sender,
	}

	c := Core{ctx, logger, db, nk}
	messageID, err := MessageUpdateMessage(c, input.GameID, message, input.MessageID)

	if err != nil {
		return "", err
	}

	return *messageID, nil
}

// RPCDeleteMessages : RPC - DeleteMessages
func RPCDeleteMessages(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID     string   `json:"game_id"`
		MessageIDs []string `json:"message_ids"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := MessageDeleteMessages(c, input.GameID, input.MessageIDs)

	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCGetMatches : RPC - GetMatches
func RPCGetMatches(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string `json:"game_id"`
		ContextID string `json:"context_id"`
		Username  string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}
	var response map[string]*Match
	var err error
	if len(input.ContextID) > 0 {
		response, err = ContextGetMatches(c, input.GameID, input.ContextID)

		if err != nil {
			return "", err
		}
	} else {
		response, err = UserGetMatches(c, input.GameID, input.Username)

		if err != nil {
			return "", err
		}
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCSendMatch : RPC - SendMatch
func RPCSendMatch(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string      `json:"game_id"`
		ContextID string      `json:"context_id"`
		MatchID   string      `json:"match_id"`
		Turn      string      `json:"turn"`
		Content   interface{} `json:"content"`
		Usernames []string    `json:"usernames"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	match := Match{
		Turn:      input.Turn,
		Usernames: input.Usernames,
		Content:   input.Content,
	}
	if len(input.Usernames) > 0 {
		match.Usernames = input.Usernames
	} else {
		match.ContextID = input.ContextID
	}

	c := Core{ctx, logger, db, nk}
	matchID, err := MatchUpdateMatch(c, input.GameID, match, input.MatchID)

	output := map[string]string{
		"match_id": *matchID,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCUpdateMatch : RPC - UpdateMatch
func RPCUpdateMatch(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID  string      `json:"game_id"`
		MatchID string      `json:"match_id"`
		Turn    string      `json:"turn"`
		Content interface{} `json:"content"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	match := Match{
		Turn:    input.Turn,
		Content: input.Content,
	}

	c := Core{ctx, logger, db, nk}
	matchID, err := MatchUpdateMatch(c, input.GameID, match, input.MatchID)

	if err != nil {
		return "", err
	}

	return *matchID, nil
}

// RPCDeleteMatches : RPC - DeleteMatches
func RPCDeleteMatches(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string   `json:"game_id"`
		MatchIDs []string `json:"match_ids"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := MatchDeleteMatches(c, input.GameID, input.MatchIDs)

	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCGetPushes : RPC - GetPushes
func RPCGetPushes(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string `json:"game_id"`
		ContextID string `json:"context_id"`
		Username  string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := UserGetPushes(c, input.GameID, input.Username)
	if err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCAddPush : RPC - AddPush
func RPCAddPush(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string `json:"game_id"`
		PushID    string `json:"push_id"`
		Username  string `json:"username"`
		AuthToken string `json:"auth_token"`
		AppID     string `json:"app_id"`
		Message   string `json:"message"`
		Timestamp int64  `json:"timestamp"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	push := Push{
		Username:  input.Username,
		AuthToken: input.AuthToken,
		AppID:     input.AppID,
		Message:   input.Message,
		Timestamp: input.Timestamp,
	}

	c := Core{ctx, logger, db, nk}
	pushID, err := PushAddPush(c, input.GameID, push, input.PushID)

	if err != nil {
		return "", err
	}

	return *pushID, nil
}

// RPCDeletePushes : RPC - DeletePushes
func RPCDeletePushes(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID  string   `json:"game_id"`
		PushIDs []string `json:"push_ids"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := PushDeletePushes(c, input.GameID, input.PushIDs)

	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCSetUserID : RPC - SetUserID
func RPCSetUserID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
		UserID   string `json:"user_id"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	if err := UserSetUserID(c, input.GameID, input.Username, input.UserID); err != nil {
		return "", err
	}

	return "", nil
}

// RPCGetUserID : RPC - GetUserID
func RPCGetUserID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := UserGetUserID(c, input.GameID, input.Username)
	if err != nil {
		return "", err
	}

	if response == (*string)(nil) {
		defaultUserID := ""
		response = &defaultUserID
	}

	output := map[string]string{
		"user_id": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCGetUsername : RPC - GetUsername
func RPCGetUsername(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	userID, ok := ctx.Value(runtime.RUNTIME_CTX_USER_ID).(string)
	if !ok {
		return "", errors.New("cannot get username")
	}

	output := map[string]string{
		"username": userID,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCGetUserIDs : RPC - GetUserIDs
func RPCGetUserIDs(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string   `json:"game_id"`
		Usernames []string `json:"usernames"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := UserGetUserIDs(c, input.GameID, input.Usernames)
	if err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSetPSID : RPC - FacebookSetPSID
func RPCFacebookSetPSID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
		PSID     string `json:"psid"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := FacebookSetPSID(c, input.GameID, input.Username, input.PSID)

	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCFacebookGetPSID : RPC - FacebookGetPSID
func RPCFacebookGetPSID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	ptrPSID, err := FacebookGetPSID(c, input.GameID, input.Username)
	if err != nil {
		return "", err
	}

	if ptrPSID == (*string)(nil) {
		defaultPSID := ""
		ptrPSID = &defaultPSID
	}

	output := map[string]string{
		"value": *ptrPSID,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookGetUsernamesWithPSID : RPC - FacebookGetUsernamesWithPSID
func RPCFacebookGetUsernamesWithPSID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID string `json:"game_id"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := FacebookGetUsernamesWithPSID(c, input.GameID)
	if err != nil {
		return "", err
	}

	output := map[string][]string{
		"usernames": response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookGetRandomUsernamesWithPSID : RPC - FacebookGetRandomUsernamesWithPSID
func RPCFacebookGetRandomUsernamesWithPSID(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID string `json:"game_id"`
		Count  int    `json:"count"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	usernames, err := FacebookGetUsernamesWithPSID(c, input.GameID)
	if err != nil {
		return "", err
	}

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(usernames), func(i, j int) { usernames[i], usernames[j] = usernames[j], usernames[i] })

	count := math.Min(float64(len(usernames)), float64(input.Count))
	newUsernames := usernames[:int(count)]

	output := map[string][]string{
		"usernames": newUsernames,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCSetProfile : RPC - SetProfile
func RPCSetProfile(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID      string `json:"game_id"`
		Username    string `json:"username"`
		DisplayName string `json:"display_name"`
		ProfilePic  string `json:"profile_pic"`
		UserID      string `json:"user_id"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	profile := Profile{
		ProfilePic:  input.ProfilePic,
		DisplayName: input.DisplayName,
		Username:    input.Username,
	}

	c := Core{ctx, logger, db, nk}

	if err := ProfileSave(c, input.GameID, input.Username, profile); err != nil {
		return "", err
	}

	if len(input.UserID) > 0 {
		if err := UserSetUserID(c, input.GameID, input.Username, input.UserID); err != nil {
			return "", err
		}
	}

	return "", nil
}

// RPCGetProfile : RPC - GetProfile
func RPCGetProfile(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := ProfileLoad(c, input.GameID, input.Username)
	if err != nil {
		return "", err
	}

	if response == (*Profile)(nil) {
		response = &Profile{
			Username: input.Username,
		}
	}

	stringResponse, err := json.Marshal(*response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCGetProfiles : RPC - GetProfiles
func RPCGetProfiles(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	type Input struct {
		GameID    string   `json:"game_id"`
		Usernames []string `json:"usernames"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := ProfileLoadMultiple(c, input.GameID, input.Usernames)
	if err != nil {
		return "", err
	}

	output := map[string][]*Profile{
		"value": response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSendBotMessageText : RPC - FacebookSendBotMessageText
func RPCFacebookSendBotMessageText(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input FacebookBotMessageTextInput
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := FacebookSendBotMessageText(c, input)
	if err != nil {
		return "", err
	}

	if response != (*string)(nil) {
		defaultResponse := ""
		response = &defaultResponse
	}

	output := map[string]string{
		"response": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil

}

// RPCFacebookSendBotMessageImage : RPC - FacebookSendBotMessageImage
func RPCFacebookSendBotMessageImage(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input FacebookBotMessageImageInput
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := FacebookSendBotMessageImage(c, input)
	if err != nil {
		return "", err
	}

	if response != (*string)(nil) {
		defaultResponse := ""
		response = &defaultResponse
	}

	output := map[string]string{
		"response": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSendBotMessageButton : RPC - FacebookSendBotMessageButton
func RPCFacebookSendBotMessageButton(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input FacebookBotMessageButtonInput
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := FacebookSendBotMessageButton(c, input)
	if err != nil {
		return "", err
	}

	if response != (*string)(nil) {
		defaultResponse := ""
		response = &defaultResponse
	}

	output := map[string]string{
		"response": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSendBotMessageMedia : RPC - FacebookSendBotMessageMedia
func RPCFacebookSendBotMessageMedia(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input FacebookBotMessageMediaInput
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := FacebookSendBotMessageMedia(c, input)
	if err != nil {
		return "", err
	}

	if response != (*string)(nil) {
		defaultResponse := ""
		response = &defaultResponse
	}

	output := map[string]string{
		"response": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSendDelayedBotMessages : RPC - FacebookSendDelayedBotMessages
func RPCFacebookSendDelayedBotMessages(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	c := Core{ctx, logger, db, nk}
	responses, err := FacebookSendDelayedBotMessages(c)
	if err != nil {
		return "", err
	}

	output := map[string]interface{}{
		"value": responses,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookCheckDelayedBotMessages : RPC - FacebookCheckDelayedBotMessages
func RPCFacebookCheckDelayedBotMessages(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID string `json:"game_id"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}
	botMessageIDs, err := FacebookGetDelayedBotMessageIDs(c, input.GameID)
	if err != nil {
		return "", err
	}

	response, err := FacebookGetDelayedBotMessages(c, input.GameID, botMessageIDs)
	if err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCFacebookSendAllNotif : RPC - FacebookSendAllNotif
func RPCFacebookSendAllNotif(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	c := Core{ctx, logger, db, nk}
	err := FacebookSendAllNotif(c)
	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCFacebookSendNotif : RPC - FacebookSendNotif
func RPCFacebookSendNotif(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID   string `json:"game_id"`
		Username string `json:"username"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}
	err := FacebookSendNotif(c, input.GameID, input.Username)
	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCFacebookSendFriendOnline : RPC - FacebookSendFriendOnline
func RPCFacebookSendFriendOnline(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	type Input struct {
		GameID    string   `json:"game_id"`
		Sender    string   `json:"sender"`
		Receivers []string `json:"receivers"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}
	response, err := FacebookSendFriendOnline(c, input.GameID, input.Sender, input.Receivers)
	if err != nil {
		return "", err
	}

	if response == (*string)(nil) {
		defaultResponse := ""
		response = &defaultResponse
	}

	output := map[string]string{
		"value": *response,
	}

	stringResponse, err := json.Marshal(output)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCLeaderboardFetch : RPC - LeaderboardFetch
func RPCLeaderboardFetch(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input LeaderboardFetchRequest
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := LeaderboardFetch(c, input)
	if err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCLeaderboardSubmit : RPC - LeaderboardSubmit
func RPCLeaderboardSubmit(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	userID, ok := ctx.Value(runtime.RUNTIME_CTX_USER_ID).(string)
	if !ok {
		return "", errors.New("cannot get userID")
	}

	username, ok := ctx.Value(runtime.RUNTIME_CTX_USERNAME).(string)
	if !ok {
		return "", errors.New("cannot get username")
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input LeaderboardSubmitRequest
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := LeaderboardSubmit(c, userID, username, input)
	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCStreamJoin : RPC - StreamJoin
func RPCStreamJoin(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	userID, ok := ctx.Value(runtime.RUNTIME_CTX_USER_ID).(string)
	if !ok {
		return "", errors.New("userID invalid")
	}

	sessionID, ok := ctx.Value(runtime.RUNTIME_CTX_SESSION_ID).(string)
	if !ok {
		return "", errors.New("sessionID invalid")
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input StreamRequest
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	response, err := StreamJoin(c, userID, sessionID, input)
	if err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}

// RPCStreamLeave : RPC - StreamLeave
func RPCStreamLeave(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	userID, ok := ctx.Value(runtime.RUNTIME_CTX_USER_ID).(string)
	if !ok {
		return "", errors.New("userID invalid")
	}

	sessionID, ok := ctx.Value(runtime.RUNTIME_CTX_SESSION_ID).(string)
	if !ok {
		return "", errors.New("sessionID invalid")
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input StreamRequest
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := StreamLeave(c, userID, sessionID, input)
	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCStreamSendData : RPC - StreamSendData
func RPCStreamSendData(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	userID, ok := ctx.Value(runtime.RUNTIME_CTX_USER_ID).(string)
	if !ok {
		return "", errors.New("userID invalid")
	}

	username, ok := ctx.Value(runtime.RUNTIME_CTX_USERNAME).(string)
	if !ok {
		return "", errors.New("username invalid")
	}

	sessionID, ok := ctx.Value(runtime.RUNTIME_CTX_SESSION_ID).(string)
	if !ok {
		return "", errors.New("sessionID invalid")
	}

	type Input struct {
		Stream StreamRequest `json:"stream"`
		Data   interface{}   `json:"data"`
	}

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input Input
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	c := Core{ctx, logger, db, nk}

	err := StreamSendData(c, userID, username, sessionID, input.Stream, input.Data)
	if err != nil {
		return "", err
	}

	return "", nil
}

// RPCCronHourly : RPC CronHourly
func RPCCronHourly(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	c := Core{ctx, logger, db, nk}

	return "", CronHourly(c, payload)
}

// RPCCronDaily : RPC CronDaily
func RPCCronDaily(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	c := Core{ctx, logger, db, nk}

	return "", CronDaily(c, payload)
}

// RPCCron10Minutes : RPC Cron10Minutes
func RPCCron10Minutes(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	c := Core{ctx, logger, db, nk}

	return "", Cron10Minutes(c, payload)
}

// RPCDummy : RPC - Dummy
func RPCDummy(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

	// "payload" is bytes sent by the client we'll JSON decode it.
	var input interface{}
	if err := json.Unmarshal([]byte(payload), &input); err != nil {
		return "", err
	}

	stringResponse, err := json.Marshal(input)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
}
