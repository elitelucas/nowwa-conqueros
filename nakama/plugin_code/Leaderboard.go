package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"sort"

	"github.com/heroiclabs/nakama-common/api"
)

const dailyLeaderboardID string = "daily_leaderboard_id"
const weeklyLeaderboardID string = "weekly_leaderboard_id"
const allTimeLeaderboardID string = "all_time_leaderboard_id"

// InitLeaderboard : Leaderboard - Initialize
func InitLeaderboard(c Core) {

	authoritative := false
	sort := "desc"
	operator := "best"
	resetDaily := "0 0 * * *"
	resetWeekly := "0 0 * * 0"
	resetAllTime := ""
	metadata := map[string]interface{}{}

	games := GameGetInfo()

	for gameID := range games {
		c.nk.LeaderboardCreate(c.ctx, gameID+"|"+dailyLeaderboardID, authoritative, sort, operator, resetDaily, metadata)
		c.nk.LeaderboardCreate(c.ctx, gameID+"|"+weeklyLeaderboardID, authoritative, sort, operator, resetWeekly, metadata)
		c.nk.LeaderboardCreate(c.ctx, gameID+"|"+allTimeLeaderboardID, authoritative, sort, operator, resetAllTime, metadata)
	}
}

// LeaderboardFetchRequest : Detailed struct for requesting leaderboard
type LeaderboardFetchRequest struct {
	GameID         string   `json:"game_id"`
	LearderboardID string   `json:"leaderboard_id"`
	IsFriendOnly   bool     `json:"is_friend_only"`
	Cursor         string   `json:"next_page"`
	Usernames      []string `json:"usernames"`
	Limit          int      `json:"limit"`
}

// LeaderboardSubmitRequest : Detailed struct for submitting leaderboard
type LeaderboardSubmitRequest struct {
	GameID   string `json:"game_id"`
	Score    int64  `json:"score"`
	Subscore int64  `json:"subscore"`
}

// LeaderboardResponse : Detailed struct for  leaderboard response
type LeaderboardResponse struct {
	LearderboardID string             `json:"leaderboard_id"`
	Entries        []LeaderboardEntry `json:"entries"`
	NextPage       string             `json:"next_cursor"`
	PrevPage       string             `json:"prev_cursor"`
	IsFriendOnly   bool               `json:"is_friend_only"`
}

// LeaderboardEntry : Detailed struct for getting leaderboard entry
type LeaderboardEntry struct {
	Rank     int64   `json:"rank"`
	Score    int64   `json:"score"`
	PlayerID string  `json:"player_id"`
	Profile  Profile `json:"profile"`
}

// LeaderboardFetch : Leaderboard - Fetch leaderboard data
func LeaderboardFetch(c Core, req LeaderboardFetchRequest) (*LeaderboardResponse, error) {

	ownerIDs := []string{}
	if req.IsFriendOnly {
		usernameUserIDPairs, err := UserGetUserIDs(c, req.GameID, req.Usernames)
		if err != nil {
			return nil, err
		}
		for _, userID := range usernameUserIDPairs {
			ownerIDs = append(ownerIDs, *userID)
		}
	}

	expiry := int64(0)
	records, ownerRecords, prevCursor, nextCursor, err := c.nk.LeaderboardRecordsList(c.ctx, req.LearderboardID, ownerIDs, req.Limit, req.Cursor, expiry)
	if err != nil {
		return nil, err
	}

	entries := []LeaderboardEntry{}
	var userIDs []string
	var refRecords []*api.LeaderboardRecord
	if req.IsFriendOnly {
		refRecords = ownerRecords
	} else {
		refRecords = records
	}

	userIDs = make([]string, len(refRecords))
	for index, value := range refRecords {
		//username := strings.Replace(value.Username.Value, req.GameID+"|", "", 1)
		username := value.Username.Value
		profile, _ := ProfileLoad(c, req.GameID, username)
		hasProfile := profile != (*Profile)(nil)
		if hasProfile {
			entries = append(entries, LeaderboardEntry{
				Rank:     value.Rank,
				Score:    value.Score,
				PlayerID: username,
				Profile:  *profile,
			})
		} else {
			entries = append(entries, LeaderboardEntry{
				Rank:     value.Rank,
				Score:    value.Score,
				PlayerID: username,
			})
		}
		userIDs[index] = value.OwnerId
	}

	if len(entries) > 0 {
		sort.Slice(entries, func(i, j int) bool {
			return entries[i].Score > entries[j].Score
		})
	}
	for index := range entries {
		entries[index].Rank = int64(index + 1)
	}

	var output LeaderboardResponse
	if req.IsFriendOnly {
		output = LeaderboardResponse{
			Entries:        entries,
			LearderboardID: req.LearderboardID,
			IsFriendOnly:   req.IsFriendOnly,
		}
	} else {
		output = LeaderboardResponse{
			Entries:        entries,
			LearderboardID: req.LearderboardID,
			IsFriendOnly:   req.IsFriendOnly,
			NextPage:       nextCursor,
			PrevPage:       prevCursor,
		}
	}

	if err != nil {
		return nil, err
	}
	return &output, nil
}

// LeaderboardCreate : Leaderboard - Create
func LeaderboardCreate(c Core, leaderboardID string) error {
	authoritative := false
	sort := "desc"
	operator := "best"
	resetNever := ""
	metadata := map[string]interface{}{}

	return c.nk.LeaderboardCreate(c.ctx, leaderboardID, authoritative, sort, operator, resetNever, metadata)
}

// LeaderboardDelete : Leaderboard - Delete
func LeaderboardDelete(c Core, id string) error {
	return c.nk.LeaderboardDelete(c.ctx, id)
}

// LeaderboardCheck : Leaderboard - check if leaderboard exists for the current time
func LeaderboardCheck(c Core, gameID string) (*int, error) {

	nowWeek := GetWeek()
	modWeek := nowWeek % 4

	info := DataCreateInfo("leaderboard", "leaderboard_data")

	dataString, err := DataLoad(c, gameID, info)
	if err != nil {
		return nil, err
	}

	if dataString == (*string)(nil) {
		// no leaderboard data found
		newData := make(map[string]interface{})
		newData["nowWeek"] = nowWeek
		newData[fmt.Sprintf("week_%d", modWeek)] = nowWeek
		if err := DataSave(c, gameID, info, newData); err != nil {
			return nil, err
		}
		return &modWeek, nil
	}

	var output map[string]interface{}
	if err := json.Unmarshal([]byte(*dataString), &output); err != nil {
		return nil, err
	}

	rawPrevWeek := output["nowWeek"]
	prevWeek := int(rawPrevWeek.(float64))
	// check if still same week
	if nowWeek > prevWeek {
		output["nowWeek"] = nowWeek
		stringWeek := fmt.Sprintf("week_%d", modWeek)
		if rawSavedWeek, ok := output[stringWeek]; !ok || int(rawSavedWeek.(float64)) != modWeek {
			// if leaderboard exists, delete it first
			if ok {
				if err := LeaderboardDelete(c, fmt.Sprintf("lead_%s_week_%d", gameID, modWeek)); err != nil {
					return nil, errors.New("cannot delete leaderboard")
				}
			}
			if err := LeaderboardCreate(c, fmt.Sprintf("lead_%s_week_%d", gameID, modWeek)); err != nil {
				return nil, errors.New("cannot create leaderboard")
			}
			output[stringWeek] = nowWeek
		}
		if err := DataSave(c, gameID, info, output); err != nil {
			return nil, err
		}
	}
	return &modWeek, nil
}

// LeaderboardSubmit : Leaderboard - Submit score
func LeaderboardSubmit(c Core, userID string, username string, req LeaderboardSubmitRequest) error {

	metadata := make(map[string]interface{})

	ptrModWeek, err := LeaderboardCheck(c, req.GameID)
	if err != nil {
		return err
	}

	modWeek := *ptrModWeek

	if _, err := c.nk.LeaderboardRecordWrite(c.ctx, fmt.Sprintf("lead_%s_week_%d", req.GameID, modWeek), userID, username, req.Score, req.Subscore, metadata, nil); err != nil {
		return err
	}

	return nil
}
