package main

import (
	"encoding/json"
	"strconv"
	"strings"
)

// Match : Detailed struct for match
type Match struct {
	Turn      string      `json:"turn"`
	Content   interface{} `json:"content"`
	Usernames []string    `json:"usernames"`
	ContextID string      `json:"context_id"`
}

// MatchGetMatches : Match - GetMatches
func MatchGetMatches(c Core, gameID string, matchIDs []string) (map[string]*Match, error) {

	if len(matchIDs) > 0 {

		infos := make([]*DataInfo, len(matchIDs))
		for index, matchID := range matchIDs {
			info := DataCreateInfo(matchID, "match_data")
			infos[index] = info
		}

		data, err := DataLoadMultiple(c, gameID, infos)
		if err != nil {
			return nil, err
		}

		output := make(map[string]*Match)
		for fullMatchID, rawMatch := range data {
			var match Match
			if err := json.Unmarshal([]byte(*rawMatch), &match); err != nil {
				// handle error
				continue
			}

			matchIDParts := strings.Split(fullMatchID, "|")
			matchID := matchIDParts[1]
			output[matchID] = &match
		}

		return output, nil
	}

	return map[string]*Match{}, nil
}

// MatchDeleteMatches : Match - DeleteMatches
func MatchDeleteMatches(c Core, gameID string, matchIDs []string) error {

	matches, err := MatchGetMatches(c, gameID, matchIDs)
	if err != nil {
		return err
	}

	for matchID, match := range matches {

		if len(match.ContextID) >= 0 {
			if err := ContextDeleteMatches(c, gameID, match.ContextID, []string{matchID}); err != nil {
				// handle error
			}
		}

		if len(match.Usernames) > 0 {
			for _, username := range match.Usernames {
				err := UserDeleteMatches(c, gameID, username, []string{matchID})
				if err != nil {
					// handle error
				}
			}
		}

	}

	infos := make([]*DataInfo, len(matchIDs))
	for index, matchID := range matchIDs {
		info := DataCreateInfo(matchID, "match_data")
		infos[index] = info
	}

	if err := DataDeleteMultiple(c, gameID, infos); err != nil {
		return err
	}

	return nil
}

// MatchUpdateMatch : Match - UpdateMatch
func MatchUpdateMatch(c Core, gameID string, match Match, matchID string) (*string, error) {

	newMatchID := matchID
	if len(matchID) == 0 {
		newMatchID = strconv.FormatInt(GetNowMillisecond(), 16)
	}

	matches, err := MatchGetMatches(c, gameID, []string{newMatchID})
	if err != nil {
		return nil, err
	}

	newMatch, ok := matches[newMatchID]
	if !ok {
		newMatch = &Match{}
	}

	if match.Content != nil {
		newMatch.Content = match.Content
	}
	newMatch.Turn = match.Turn
	if match.Usernames != nil {
		newMatch.Usernames = match.Usernames
	}
	if len(match.ContextID) > 0 {
		newMatch.ContextID = match.ContextID
	}

	info := DataCreateInfo(newMatchID, "match_data")

	err = DataSave(c, gameID, info, *newMatch)
	if err != nil {
		return nil, err
	}

	if len(newMatch.Usernames) > 0 {
		for _, username := range newMatch.Usernames {
			UserAddMatches(c, gameID, username, []string{newMatchID})
		}
	}

	if len(newMatch.ContextID) > 0 {
		ContextAddMatches(c, gameID, newMatch.ContextID, []string{newMatchID})
	}

	return &newMatchID, nil
}
