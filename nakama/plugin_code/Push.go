package main

import (
	"encoding/json"
	"strconv"
	"strings"
)

// Push : Detailed struct for storing push notification
type Push struct {
	Username  string `json:"username"`
	AuthToken string `json:"auth_token"`
	AppID     string `json:"app_id"`
	Message   string `json:"message"`
	Timestamp int64  `json:"timestamp"`
}

// PushGetPushes : Push - GetPushes
func PushGetPushes(c Core, gameID string, pushIDs []string) (map[string]*Push, error) {

	if len(pushIDs) > 0 {

		infos := make([]*DataInfo, len(pushIDs))
		for index, pushID := range pushIDs {
			info := DataCreateInfo(pushID, "push_data")
			infos[index] = info
		}

		data, err := DataLoadMultiple(c, gameID, infos)
		if err != nil {
			return nil, err
		}

		output := make(map[string]*Push)
		for fullPushID, rawPush := range data {
			var push Push
			if err := json.Unmarshal([]byte(*rawPush), &push); err != nil {
				// handle error
				continue
			}
			pushIDParts := strings.Split(fullPushID, "|")
			pushID := pushIDParts[1]
			output[pushID] = &push
		}

		return output, nil
	}

	return map[string]*Push{}, nil
}

// PushDeletePushes : Push - DeletePushes
func PushDeletePushes(c Core, gameID string, pushIDs []string) error {

	pushes, err := PushGetPushes(c, gameID, pushIDs)
	if err != nil {
		return err
	}

	for pushID, push := range pushes {
		err := UserDeletePushes(c, gameID, push.Username, []string{pushID})
		if err != nil {
			// handle error
			continue
		}
	}

	infos := make([]*DataInfo, len(pushIDs))
	for index, pushID := range pushIDs {
		info := DataCreateInfo(pushID, "push_data")
		infos[index] = info
	}

	if err := DataDeleteMultiple(c, gameID, infos); err != nil {
		return err
	}

	return nil
}

// PushAddPush : Push - AddPush
func PushAddPush(c Core, gameID string, push Push, pushID string) (*string, error) {

	newPushID := pushID
	if len(pushID) == 0 {
		newPushID = strconv.FormatInt(GetNowMillisecond(), 16)
	}

	pushes, err := PushGetPushes(c, gameID, []string{newPushID})
	if err != nil {
		return nil, err
	}

	newPush, ok := pushes[newPushID]
	if !ok {
		newPush = &Push{}
	}

	info := DataCreateInfo(newPushID, "push_data")

	err = DataSave(c, gameID, info, *newPush)
	if err != nil {
		return nil, err
	}

	return &newPushID, UserAddPushes(c, gameID, push.Username, []string{newPushID})
}
