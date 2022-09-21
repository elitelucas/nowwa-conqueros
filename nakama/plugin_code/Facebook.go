package main

import (
	"encoding/json"
	"errors"
	"math/rand"
	"strconv"
	"strings"
)

// FacebookLastNotif : Detailed struct for facebook notification
type FacebookLastNotif struct {
	Timestamp int64 `json:"timestamp"`
}

// FacebookPSID : Detailed struct for facebook psid
type FacebookPSID struct {
	PSID string `json:"psid"`
}

// FacebookBotMessageRecipient :
type FacebookBotMessageRecipient struct {
	ID string `json:"id"`
}

// FacebookDelayedBotMessage :
type FacebookDelayedBotMessage struct {
	Params FacebookBotMessageParams `json:"params"`
	Delay  int64                    `json:"delay"`
	GameID string                   `json:"game_id"`
}

// FacebookBotMessageButton :
type FacebookBotMessageButton struct {
	Type  string `json:"type"`
	Title string `json:"title"`
}

// FacebookBotMessageElement :
type FacebookBotMessageElement struct {
	Title    string                     `json:"title"`
	Text     string                     `json:"text"`
	ImageURL string                     `json:"image_url"`
	Subtitle string                     `json:"subtitle"`
	Buttons  []FacebookBotMessageButton `json:"buttons"`
}

// FacebookBotMessagePayload :
type FacebookBotMessagePayload struct {
	TemplateType string                      `json:"template_type"`
	Elements     []FacebookBotMessageElement `json:"elements"`
	Text         string                      `json:"text"`
	Buttons      []FacebookBotMessageButton  `json:"buttons"`
	ImageURL     string                      `json:"image_url"`
}

// FacebookBotMessageAttachment :
type FacebookBotMessageAttachment struct {
	Type    string                    `json:"type"`
	Payload FacebookBotMessagePayload `json:"payload"`
}

// FacebookBotMessageMessage :
type FacebookBotMessageMessage struct {
	Attachment FacebookBotMessageAttachment `json:"attachment"`
	Text       string                       `json:"text"`
}

// FacebookBotMessageParams : Detailed struct for bot message
type FacebookBotMessageParams struct {
	MessagingType string                      `json:"messaging_type"`
	Recipient     FacebookBotMessageRecipient `json:"recipient"`
	Message       FacebookBotMessageMessage   `json:"message"`
}

// FacebookBotMessageTextInput : Detailed struct for bot message text
type FacebookBotMessageTextInput struct {
	ShortDesc string `json:"short_desc"`
	LongDesc  string `json:"long_desc"`
	Delay     int64  `json:"delay"`
	GameID    string `json:"game_id"`
	Username  string `json:"username"`
	Text      string `json:"text"`
	Subtitle  string `json:"subtitle"`
}

// FacebookBotMessageImageInput : Detailed struct for bot message image
type FacebookBotMessageImageInput struct {
	Delay    int64  `json:"delay"`
	GameID   string `json:"game_id"`
	Username string `json:"username"`
	ImageURL string `json:"image_url"`
}

// FacebookBotMessageButtonInput : Detailed struct for bot message button
type FacebookBotMessageButtonInput struct {
	Delay    int64  `json:"delay"`
	GameID   string `json:"game_id"`
	Username string `json:"username"`
	Text     string `json:"text"`
}

// FacebookBotMessageMediaInput : Detailed struct for bot message media
type FacebookBotMessageMediaInput struct {
	ShortDesc string `json:"short_desc"`
	LongDesc  string `json:"long_desc"`
	Delay     int64  `json:"delay"`
	GameID    string `json:"game_id"`
	Username  string `json:"username"`
	Text      string `json:"text"`
	ImageURL  string `json:"image_url"`
	Subtitle  string `json:"subtitle"`
}

// FacebookGetData :
// Retrieve facebook's custom data.
// Returns empty object if not found
func FacebookGetData(c Core, gameID string, username string) (map[string]interface{}, error) {

	info := DataCreateInfo(username, "facebook_data")

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

// FacebookSetData : Facebook - SetData
func FacebookSetData(c Core, gameID string, username string, data map[string]interface{}) error {

	info := DataCreateInfo(username, "facebook_data")

	return DataSave(c, gameID, info, data)
}

// FacebookGetKeyValue : Facebook - GetKeyValue
func FacebookGetKeyValue(c Core, gameID string, username string, key string) (map[string]interface{}, error) {

	info := DataCreateInfo(username, "facebook_data")

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

// FacebookSetKeyValue : Facebook - SetKeyValue
func FacebookSetKeyValue(c Core, gameID string, username string, key string, value interface{}) error {

	info := DataCreateInfo(username, "facebook_data")

	return DataSaveKey(c, gameID, info, key, value)
}

// FacebookSetNotification : Facebook - SetNotification
func FacebookSetNotification(c Core, gameID string, username string, data FacebookLastNotif) error {
	info := DataCreateInfo(username, "facebook_extra")

	return DataSaveKey(c, gameID, info, "notif", data)
}

// FacebookGetNotification : Facebook - GetNotification
func FacebookGetNotification(c Core, gameID string, username string) (*FacebookLastNotif, error) {
	info := DataCreateInfo(username, "facebook_extra")

	rawNotif, err := DataLoadKey(c, gameID, info, "notif")
	if err != nil {
		return nil, err
	}

	if rawNotif != (*string)(nil) {

		var notif FacebookLastNotif
		if err := json.Unmarshal([]byte(*rawNotif), &notif); err != nil {
			return nil, err
		}

		return &notif, nil
	}

	return nil, nil
}

// FacebookGetPSID : Facebook - GetPSID
func FacebookGetPSID(c Core, gameID string, username string) (*string, error) {
	info := DataCreateInfo(username, "facebook_extra")

	rawPSID, err := DataLoadKey(c, gameID, info, "psid")
	if err != nil {
		return nil, err
	}

	if rawPSID != (*string)(nil) {

		var psID string
		if err := json.Unmarshal([]byte(*rawPSID), &psID); err != nil {
			return nil, err
		}

		return &psID, nil
	}

	return nil, nil

}

// FacebookSetPSID : Facebook - SetPSID
func FacebookSetPSID(c Core, gameID string, username string, psID string) error {
	info := DataCreateInfo(username, "facebook_extra")

	if err := DataSaveKey(c, gameID, info, "psid", psID); err != nil {
		return err
	}

	return FacebookAddUsernameWithPSID(c, gameID, username)
}

// FacebookGetUsernamesWithPSID : Facebook - PrepUsernamesWithPSID
func FacebookGetUsernamesWithPSID(c Core, gameID string) ([]string, error) {

	info := DataCreateInfo(gameID, "facebook_config")

	rawUsernames, err := DataLoadKey(c, gameID, info, "usernames_with_psid")
	if err != nil {
		return nil, err
	}

	if rawUsernames != (*string)(nil) {

		var usernames []string
		if err := json.Unmarshal([]byte(*rawUsernames), &usernames); err != nil {
			return nil, err
		}

		return usernames, nil
	}

	return []string{}, nil
}

// FacebookAddUsernameWithPSID :  Facebook - AddUsernameWithPSID
func FacebookAddUsernameWithPSID(c Core, gameID string, username string) error {
	newUsernames, err := FacebookGetUsernamesWithPSID(c, gameID)
	if err != nil {
		return err
	}

	isChanged := false
	matchIndex := IndexValue(newUsernames, username)
	if matchIndex < 0 {
		newUsernames = append(newUsernames, username)
		isChanged = true
	}

	if isChanged {
		return FacebookSetUsernamesWithPSID(c, gameID, newUsernames)
	}

	return nil
}

// FacebookSetUsernamesWithPSID :  Facebook - SetUsernameWithPSID
func FacebookSetUsernamesWithPSID(c Core, gameID string, usernames []string) error {

	info := DataCreateInfo(gameID, "facebook_config")

	return DataSaveKey(c, gameID, info, "usernames_with_psid", usernames)
}

//region Bot Message

// FacebookSendBotMessage :  Facebook - SendBotMessage
func FacebookSendBotMessage(c Core, gameID string, params FacebookBotMessageParams, delay int64) (*string, error) {

	gameInfo, ok := GameGetInfo()[gameID]
	if !ok {
		return nil, errors.New("invalid gameID")
	}
	if len(gameInfo.FacebookAccessToken) == 0 {
		return nil, errors.New("access token not found")
	}

	if delay > 0 {
		botMessage := FacebookDelayedBotMessage{
			GameID: gameID,
			Params: params,
			Delay:  delay,
		}
		return nil, FacebookAddDelayedBotMessage(c, &botMessage)
	}

	fbURL := "https://graph.facebook.com/v5.0/me/messages?access_token="
	fbAccessToken := gameInfo.FacebookAccessToken

	method := "POST"
	targetURL := fbURL + fbAccessToken

	headers := map[string][]string{
		"Content-Type": []string{
			"application/json",
		},
	}

	http := HTTP{
		Method:    method,
		TargetURL: targetURL,
		Values:    params,
		Headers:   headers,
	}

	response, err := HTTPRequest(c, http)
	if err != nil {
		return nil, err
	}

	return response, nil

}

// FacebookCreateBotMessageText :  Facebook - CreateBotMessageText
func FacebookCreateBotMessageText(c Core, input FacebookBotMessageTextInput) (*FacebookBotMessageParams, error) {

	psID, err := FacebookGetPSID(c, input.GameID, input.Username)
	if err != nil {
		return nil, err
	}

	if psID != (*string)(nil) {
		params := FacebookBotMessageParams{
			MessagingType: "UPDATE",
			Recipient: FacebookBotMessageRecipient{
				ID: *psID,
			},
			Message: FacebookBotMessageMessage{
				Text: input.Text,
			},
		}

		return &params, nil
	}

	return nil, errors.New("No PSID found")
}

// FacebookSendBotMessageText :  Facebook - SendBotMessageText
func FacebookSendBotMessageText(c Core, input FacebookBotMessageTextInput) (*string, error) {
	gameInfo, ok := GameGetInfo()[input.GameID]
	if !ok {
		return nil, errors.New("invalid gameID")
	}
	if len(gameInfo.FacebookAccessToken) == 0 {
		return nil, errors.New("access token not found")
	}

	params, err := FacebookCreateBotMessageText(c, input)
	if err != nil {
		return nil, err
	}

	return FacebookSendBotMessage(c, input.GameID, *params, input.Delay)
}

// FacebookCreateBotMessageImage :  Facebook - CreateBotMessageText
func FacebookCreateBotMessageImage(c Core, input FacebookBotMessageImageInput) (*FacebookBotMessageParams, error) {

	psID, err := FacebookGetPSID(c, input.GameID, input.Username)
	if err != nil {
		return nil, err
	}

	if psID != (*string)(nil) {

		params := FacebookBotMessageParams{
			MessagingType: "UPDATE",
			Recipient: FacebookBotMessageRecipient{
				ID: *psID,
			},
			Message: FacebookBotMessageMessage{
				Attachment: FacebookBotMessageAttachment{
					Type: "image",
					Payload: FacebookBotMessagePayload{
						ImageURL: input.ImageURL,
					},
				},
			},
		}

		return &params, nil
	}

	return nil, errors.New("No PSID found")
}

// FacebookSendBotMessageImage :  Facebook - SendBotMessageImage
func FacebookSendBotMessageImage(c Core, input FacebookBotMessageImageInput) (*string, error) {
	gameInfo, ok := GameGetInfo()[input.GameID]
	if !ok {
		return nil, errors.New("invalid gameID")
	}
	if len(gameInfo.FacebookAccessToken) == 0 {
		return nil, errors.New("access token not found")
	}

	params, err := FacebookCreateBotMessageImage(c, input)
	if err != nil {
		return nil, err
	}

	return FacebookSendBotMessage(c, input.GameID, *params, input.Delay)
}

// FacebookCreateBotMessageButton :  Facebook - CreateBotMessageButton
func FacebookCreateBotMessageButton(c Core, input FacebookBotMessageButtonInput) (*FacebookBotMessageParams, error) {

	psID, err := FacebookGetPSID(c, input.GameID, input.Username)
	if err != nil {
		return nil, err
	}

	if psID != (*string)(nil) {

		params := FacebookBotMessageParams{
			MessagingType: "UPDATE",
			Recipient: FacebookBotMessageRecipient{
				ID: *psID,
			},
			Message: FacebookBotMessageMessage{
				Attachment: FacebookBotMessageAttachment{
					Type: "template",
					Payload: FacebookBotMessagePayload{
						TemplateType: "button",
						Text:         input.Text,
						Buttons: []FacebookBotMessageButton{
							FacebookBotMessageButton{
								Type:  "game_play",
								Title: "Play",
							},
						},
					},
				},
			},
		}

		return &params, nil
	}

	return nil, errors.New("No PSID found")
}

// FacebookSendBotMessageButton :  Facebook - SendBotMessageButton
func FacebookSendBotMessageButton(c Core, input FacebookBotMessageButtonInput) (*string, error) {
	gameInfo, ok := GameGetInfo()[input.GameID]
	if !ok {
		return nil, errors.New("invalid gameID")
	}
	if len(gameInfo.FacebookAccessToken) == 0 {
		return nil, errors.New("access token not found")
	}

	params, err := FacebookCreateBotMessageButton(c, input)
	if err != nil {
		return nil, err
	}

	return FacebookSendBotMessage(c, input.GameID, *params, input.Delay)
}

// FacebookCreateBotMessageMedia :  Facebook - CreateBotMessageMedia
func FacebookCreateBotMessageMedia(c Core, input FacebookBotMessageMediaInput) (*FacebookBotMessageParams, error) {

	psID, err := FacebookGetPSID(c, input.GameID, input.Username)
	if err != nil {
		return nil, err
	}

	if psID != (*string)(nil) {

		params := FacebookBotMessageParams{
			MessagingType: "UPDATE",
			Recipient: FacebookBotMessageRecipient{
				ID: *psID,
			},
			Message: FacebookBotMessageMessage{
				Attachment: FacebookBotMessageAttachment{
					Type: "template",
					Payload: FacebookBotMessagePayload{
						TemplateType: "generic",
						Elements: []FacebookBotMessageElement{
							FacebookBotMessageElement{
								Text:     input.Text,
								ImageURL: input.ImageURL,
								Subtitle: input.Subtitle,
								Buttons: []FacebookBotMessageButton{
									FacebookBotMessageButton{
										Type:  "game_play",
										Title: "Play",
									},
								},
							},
						},
					},
				},
			},
		}

		return &params, nil
	}

	return nil, errors.New("No PSID found")
}

// FacebookSendBotMessageMedia :  Facebook - SendBotMessageMedia
func FacebookSendBotMessageMedia(c Core, input FacebookBotMessageMediaInput) (*string, error) {
	gameInfo, ok := GameGetInfo()[input.GameID]
	if !ok {
		return nil, errors.New("invalid gameID")
	}
	if len(gameInfo.FacebookAccessToken) == 0 {
		return nil, errors.New("access token not found")
	}

	params, err := FacebookCreateBotMessageMedia(c, input)
	if err != nil {
		return nil, err
	}

	return FacebookSendBotMessage(c, input.GameID, *params, input.Delay)
}

//endregion

//region Delayed Bot Message

// FacebookGetDelayedBotMessageIDs : Facebook - PrepBotMessageIDs
func FacebookGetDelayedBotMessageIDs(c Core, gameID string) ([]string, error) {

	info := DataCreateInfo(gameID, "facebook_bot")

	rawBotMessageIDs, err := DataLoadKey(c, gameID, info, "bot_message_ids")
	if err != nil {
		return nil, err
	}

	if rawBotMessageIDs != (*string)(nil) {

		var botMessageIDs []string
		if err := json.Unmarshal([]byte(*rawBotMessageIDs), &botMessageIDs); err != nil {
			return nil, err
		}

		return botMessageIDs, nil
	}

	return []string{}, nil
}

// FacebookSetDelayedBotMessageIDs : Facebook - SetBotMessageIDs
func FacebookSetDelayedBotMessageIDs(c Core, gameID string, botMessageIDs []string) error {

	info := DataCreateInfo(gameID, "facebook_bot")

	return DataSaveKey(c, gameID, info, "bot_message_ids", botMessageIDs)
}

// FacebookGetDelayedBotMessages : Facebook - GetDelayedBotMessages
func FacebookGetDelayedBotMessages(c Core, gameID string, botMessageIDs []string) (map[string]*FacebookDelayedBotMessage, error) {

	if len(botMessageIDs) > 0 {

		infos := make([]*DataInfo, len(botMessageIDs))
		for index, botMessageID := range botMessageIDs {
			info := DataCreateInfo(botMessageID, "facebook_bot_message_data")
			infos[index] = info
		}

		data, err := DataLoadMultiple(c, gameID, infos)
		if err != nil {
			return nil, err
		}

		output := make(map[string]*FacebookDelayedBotMessage)
		for fullBotMessageID, rawBotMessage := range data {
			var botMesage FacebookDelayedBotMessage
			if err := json.Unmarshal([]byte(*rawBotMessage), &botMesage); err != nil {
				// handle error
				continue
			}
			botMessageIDParts := strings.Split(fullBotMessageID, "|")
			botMessageID := botMessageIDParts[1]
			output[botMessageID] = &botMesage
		}

		return output, nil
	}

	return map[string]*FacebookDelayedBotMessage{}, nil

}

// FacebookAddDelayedBotMessage :  Facebook - AddDelayedBotMessage
func FacebookAddDelayedBotMessage(c Core, botMessage *FacebookDelayedBotMessage) error {

	newBotMessageID := strconv.FormatInt(GetNowMillisecond()+botMessage.Delay, 16)

	info := DataCreateInfo(newBotMessageID, "facebook_bot_message_data")

	if err := DataSave(c, botMessage.GameID, info, *botMessage); err != nil {
		return err
	}

	newBotMessageIDs, err := FacebookGetDelayedBotMessageIDs(c, botMessage.GameID)
	if err != nil {
		return err
	}
	newBotMessageIDs = append(newBotMessageIDs, newBotMessageID)

	return FacebookSetDelayedBotMessageIDs(c, botMessage.GameID, newBotMessageIDs)

}

// FacebookDeleteDelayedBotMessages :  Facebook - DeleteDelayedBotMessages
func FacebookDeleteDelayedBotMessages(c Core, gameID string, botMessageIDs []string) error {
	newBotMessageIDs, err := FacebookGetDelayedBotMessageIDs(c, gameID)
	if err != nil {
		return err
	}

	isChanged := false
	for _, botMessageID := range botMessageIDs {
		botMessageIndex := IndexValue(newBotMessageIDs, botMessageID)
		if botMessageIndex >= 0 {
			if botMessageIndex < len(newBotMessageIDs)-1 {
				newBotMessageIDs = append(newBotMessageIDs[:botMessageIndex], newBotMessageIDs[botMessageIndex+1:]...)
			} else {
				newBotMessageIDs = newBotMessageIDs[:botMessageIndex]
			}
			isChanged = true
		}
	}

	if isChanged {
		if err := FacebookSetDelayedBotMessageIDs(c, gameID, newBotMessageIDs); err != nil {
			return err
		}

		infos := make([]*DataInfo, len(botMessageIDs))
		for index, botMessageID := range botMessageIDs {
			info := DataCreateInfo(botMessageID, "facebook_bot_message_data")
			infos[index] = info
		}

		if err := DataDeleteMultiple(c, gameID, infos); err != nil {
			return err
		}
	}

	return nil

}

// FacebookSendDelayedBotMessages :  Facebook - DeleteDelayedBotMessages
func FacebookSendDelayedBotMessages(c Core) ([]*string, error) {
	games := GameGetInfo()
	now := GetNowMillisecond()
	responses := []*string{}
	for gameID := range games {
		botMessageIDs, err := FacebookGetDelayedBotMessageIDs(c, gameID)
		if err != nil {
			// handle error
			continue
		}

		successfulBotMessageIDs := []string{}
		for _, botMessageID := range botMessageIDs {
			timestamp, err := strconv.ParseInt(botMessageID, 16, 64)
			if err != nil {
				// handle error
				continue
			}
			if now >= timestamp {
				successfulBotMessageIDs = append(successfulBotMessageIDs, botMessageID)
			}
		}

		successfulBotMessages, err := FacebookGetDelayedBotMessages(c, gameID, successfulBotMessageIDs)
		if err != nil {
			// handle error
			continue
		}

		for _, botMessage := range successfulBotMessages {
			params := botMessage.Params
			response, err := FacebookSendBotMessage(c, gameID, params, 0)
			if err != nil {
				// handle error
				continue
			}
			responses = append(responses, response)
		}

		if err := FacebookDeleteDelayedBotMessages(c, gameID, successfulBotMessageIDs); err != nil {
			// handle error
			continue
		}
	}

	return responses, nil
}

//endregion

// FacebookSendAllNotif :  Facebook - SendAllNotif
func FacebookSendAllNotif(c Core) error {
	games := GameGetInfo()

	for gameID := range games {
		usernames, err := FacebookGetUsernamesWithPSID(c, gameID)
		if err != nil {
			// handle error
			continue
		}

		for _, username := range usernames {
			if err := FacebookSendNotif(c, gameID, username); err != nil {
				// handle error
				continue
			}
		}
	}

	return nil
}

// FacebookSendNotif :  Facebook - SendNotif
func FacebookSendNotif(c Core, gameID string, username string) error {

	gameInfo, ok := GameGetInfo()[gameID]
	if !ok {
		return errors.New("invalid gameID")
	}

	newNotif, err := FacebookGetNotification(c, gameID, username)
	if err != nil {
		return err
	}

	hasPrevNotif := newNotif != (*FacebookLastNotif)(nil)

	timestamp := GetNowMillisecond()

	for _, notif := range gameInfo.Notifications {
		if !hasPrevNotif || (newNotif.Timestamp+notif.TimeSpan) <= timestamp {

			newTimestamp := notif.TimeSpan + timestamp

			if !hasPrevNotif {
				newNotif = &FacebookLastNotif{}
			}

			newNotif.Timestamp = newTimestamp
			if err := FacebookSetNotification(c, gameID, username, *newNotif); err != nil {
				// handle error
				return err
			}

			input := notif.PossibleMessages[rand.Intn(len(notif.PossibleMessages))]
			input.GameID = gameID
			input.Username = username
			if _, err := FacebookSendBotMessageMedia(c, input); err != nil {
				// handle error
				return err
			}

			break
		}
	}

	return nil
}

// FacebookSendFriendOnline :  Facebook - SendFriendOnline
func FacebookSendFriendOnline(c Core, gameID string, sender string, receivers []string) (*string, error) {
	url := "https://nakama.bulletville.com:9998/facebook_instant_friend_online"
	senderProfile, err := ProfileLoad(c, gameID, sender)
	if err != nil {
		return nil, err
	}

	if senderProfile == (*Profile)(nil) {
		return nil, errors.New("sender profile not found")
	}

	method := "POST"

	headers := map[string][]string{
		"Content-Type": []string{
			"application/json",
		},
		"Accept": []string{
			"application/json",
		},
	}

	type Output struct {
		ProfilePic    string `json:"profile_pic"`
		Username      string `json:"username"`
		GameID        string `json:"game_id"`
		NotifTemplate string `json:"notif_template"`
	}

	gameInfo, ok := GameGetInfo()[gameID]
	if !ok {
		return nil, errors.New("gameID not found")
	}

	notifTemplate := gameInfo.FriendOnlineTemplate

	params := Output{
		ProfilePic:    senderProfile.ProfilePic,
		NotifTemplate: notifTemplate,
		GameID:        gameID,
		Username:      sender,
	}

	http := HTTP{
		Method:    method,
		TargetURL: url,
		Values:    params,
		Headers:   headers,
	}

	friendOnlineURL, err := HTTPRequest(c, http)
	if err != nil {
		return nil, err
	}

	if len(*friendOnlineURL) > 0 {
		for _, receiver := range receivers {
			input := FacebookBotMessageMediaInput{
				Delay:     0,
				GameID:    gameID,
				ImageURL:  *friendOnlineURL,
				LongDesc:  "",
				ShortDesc: "",
				Text:      "Your friend is online!",
				Subtitle:  "",
				Username:  receiver,
			}
			FacebookSendBotMessageMedia(c, input)
		}
		return nil, nil
	}

	return nil, errors.New("unable to generate image")
}
