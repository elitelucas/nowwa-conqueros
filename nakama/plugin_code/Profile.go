package main

import (
	"encoding/json"
)

// Profile : Detailed struct for profile
type Profile struct {
	DisplayName string `json:"display_name"`
	ProfilePic  string `json:"profile_pic"`
	Username    string `json:"username"`
}

// ProfileSave : Profile - Save
func ProfileSave(c Core, gameID string, username string, data Profile) error {

	info := DataCreateInfo(username, "profile_data")

	return DataSave(c, gameID, info, data)
}

// ProfileLoad : Profile - Load
func ProfileLoad(c Core, gameID string, username string) (*Profile, error) {

	info := DataCreateInfo(username, "profile_data")

	rawData, err := DataLoad(c, gameID, info)
	if err != nil {
		return nil, err
	}

	if rawData != (*string)(nil) {
		var output Profile
		if err := json.Unmarshal([]byte(*rawData), &output); err != nil {
			return nil, err
		}
		return &output, nil
	}

	return nil, nil

}

// ProfileLoadMultiple : Profile - Load
func ProfileLoadMultiple(c Core, gameID string, usernames []string) ([]*Profile, error) {

	infos := make([]*DataInfo, len(usernames))
	for index, username := range usernames {
		info := DataCreateInfo(username, "profile_data")
		infos[index] = info
	}

	data, err := DataLoadMultiple(c, gameID, infos)
	if err != nil {
		return nil, err
	}

	output := make([]*Profile, len(data))
	index := 0
	for _, rawProfile := range data {
		var profile Profile
		if err := json.Unmarshal([]byte(*rawProfile), &profile); err != nil {
			// handle error
			continue
		}
		output[index] = &profile
		index++
	}

	return output, nil

}
