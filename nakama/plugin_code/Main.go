package main

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/heroiclabs/nakama-common/runtime"
)

func main() {}

// InitModule : Initialize nakama
func InitModule(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, initializer runtime.Initializer) error {
	//logger.Info("module loaded")

	//InitLeaderboard(Core{ctx, logger, db, nk})

	if err := initializer.RegisterRpc("test", test); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_data", RPCGetData); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_data_multiple", RPCGetDataMultiple); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("set_data", RPCSetData); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("send_message", RPCSendMessage); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_messages", RPCGetMessages); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("update_message", RPCUpdateMessage); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("delete_messages", RPCDeleteMessages); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("send_match", RPCSendMatch); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_matches", RPCGetMatches); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("update_match", RPCUpdateMatch); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("delete_matches", RPCDeleteMatches); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("add_push", RPCAddPush); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_pushes", RPCGetPushes); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("delete_pushes", RPCDeletePushes); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("set_user_id", RPCSetUserID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_user_id", RPCGetUserID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_user_ids", RPCGetUserIDs); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("leaderboard_fetch", RPCLeaderboardFetch); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("leaderboard_submit", RPCLeaderboardSubmit); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("stream_join", RPCStreamJoin); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("stream_leave", RPCStreamLeave); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("stream_send_data", RPCStreamSendData); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_profile", RPCGetProfile); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_profiles", RPCGetProfiles); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("set_profile", RPCSetProfile); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_set_psid", RPCFacebookSetPSID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_get_psid", RPCFacebookGetPSID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_get_usernames_with_psid", RPCFacebookGetUsernamesWithPSID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_get_random_usernames_with_psid", RPCFacebookGetRandomUsernamesWithPSID); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_bot_message_text", RPCFacebookSendBotMessageText); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_bot_message_image", RPCFacebookSendBotMessageImage); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_bot_message_button", RPCFacebookSendBotMessageButton); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_bot_message_media", RPCFacebookSendBotMessageMedia); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_delayed_bot_messages", RPCFacebookSendDelayedBotMessages); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_check_delayed_bot_messages", RPCFacebookCheckDelayedBotMessages); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_notif", RPCFacebookSendNotif); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_all_notif", RPCFacebookSendAllNotif); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("facebook_send_friend_online", RPCFacebookSendFriendOnline); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("cron_daily", RPCCronDaily); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("cron_hourly", RPCCronHourly); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("cron_10_minutes", RPCCron10Minutes); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("get_username", RPCGetUsername); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	if err := initializer.RegisterRpc("dummy", RPCDummy); err != nil {
		logger.Error("Unable to register: %v", err)
		return err
	}

	return nil
}

func test(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {

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
	/*
		// for function that does not require response
		err := UserSetUserID(c, input.GameID, input.Username, input.UserID)
		if err != nil {
			return "", err
		}
		return "", nil
		//*/

	//*
	// for function that requires response
	response, err := UserGetUserIDs(c, input.GameID, input.Usernames)
	if err != nil {
		return "", err
	}
	stringResponse, err := json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(stringResponse), nil
	//*/

}
