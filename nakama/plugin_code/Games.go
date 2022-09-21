package main

// GameInfo : Detailed struct for game
type GameInfo struct {
	FacebookAccessToken  string                                  `json:"access_token"`
	Name                 string                                  `json:"name"`
	FriendOnlineTemplate string                                  `json:"friend_online_template"`
	BotMessages          map[string]FacebookBotMessageMediaInput `json:"bot_messages"`
	Notifications        []GameFacebookNotification              `json:"notifications"`
}

// GameBotMessage : Detailed struct for game bot message
type GameBotMessage struct {
	ShortDesc   string `json:"short_desc"`
	LongDesc    string `json:"long_desc"`
	MessageType string `json:"message_type"`
	ImageURL    string `json:"image_url"`
	Text        string `json:"text"`
	Subtitle    string `json:"subtitle"`
}

// GameFacebookNotification : Detailed struct for notification
type GameFacebookNotification struct {
	TimeSpan         int64                          `json:"time_span"`
	PossibleMessages []FacebookBotMessageMediaInput `json:"possible_messages"`
}

// GameGetInfo : Games - Get list of games
func GameGetInfo() map[string]GameInfo {
	games := map[string]GameInfo{
		"Bowling": GameInfo{
			Name: "Funtabulous Bowling",
		},
		"game_test": GameInfo{
			FacebookAccessToken:  "access_token",
			Name:                 "test",
			FriendOnlineTemplate: "https://i.dlpng.com/static/png/1266636-broken-glass-png-png-images-broken-window-png-400_323_preview.png",
		},
		"1948249155211109": GameInfo{
			FacebookAccessToken:  "EAAbr7BrUj2UBAEGFlGlsEVjgseUQLIMc3dYrh6k59lHtPlKtTi7gu34rR9WoTCGTmbZCnlOOZCGFAy3vJmUEKlzhvH1dKLLv0TglbRMWy55QGElabjlc7tQZAptvwZAIKNpaAEWswYGtQuIe7ZBpFEB4XpviTjdlxgcX3tMXGCLIqZAWPZClZADZA",
			Name:                 "coin_cats",
			FriendOnlineTemplate: "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_friendsonline.png",
			BotMessages: map[string]FacebookBotMessageMediaInput{
				"welcome": FacebookBotMessageMediaInput{
					ShortDesc: "message for player after closing the session for the first time",
					ImageURL:  "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_Welcome.png",
					Text:      "Welcome to Coin Cats!",
					Subtitle:  "Coin Cats",
				},
				"replay": FacebookBotMessageMediaInput{
					ShortDesc: "message for player after 10 minutes of last playing session",
					ImageURL:  "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_Welcome.png",
					Text:      "Thank you for playing!",
					Subtitle:  "Coin Cats",
				},
			},
			Notifications: []GameFacebookNotification{
				GameFacebookNotification{
					TimeSpan: 7 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "free coins",
							LongDesc:  "free coins after 7 days offline",
							ImageURL:  "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_Welcome.png",
							Text:      "claim your free coins now!",
							Subtitle:  "Coin Cats",
						},
					},
				},
				GameFacebookNotification{
					TimeSpan: 2 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "daily reward",
							LongDesc:  "daily reward after 2 days offline",
							ImageURL:  "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_Welcome.png",
							Text:      "claim your daily rewards now!",
							Subtitle:  "Coin Cats",
						},
					},
				},
				GameFacebookNotification{
					TimeSpan: 1 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "spins_are_full",
							LongDesc:  "indicates the spins are full",
							ImageURL:  "https://nakama.bulletville.com:9998/Coin_Cats_Notifications_Welcome.png",
							Text:      "your spins are full! play now!",
							Subtitle:  "Coin Cats",
						},
						FacebookBotMessageMediaInput{
							ShortDesc: "idle_earnings",
							LongDesc:  "indicates there are coins can be collected from idle time",
							Text:      "collect your coins now!",
							Subtitle:  "Coin Cats",
						},
					},
				},
			},
		},
		"475447716665226": GameInfo{
			FacebookAccessToken:  "EAAGwasxC14oBAErVK5CQlRQBGKlxeZB0lvkXGo1hc2nSGcah6uo78bwzZADknx59uLZA4F0ZCnIJNZBZBSWYlpSRHUFfqMJ3Pbt4rd9Vq1ibP6lA3xxzX5YJcHoZBZBS1COV0gX3IwLZAvyFIjo1sEHuML8Oa10pxjjQL3ONrcEPoggZDZD",
			Name:                 "funtabulous_bowling",
			FriendOnlineTemplate: "https://webhook.nowwa.com/Coin_Cats_Notifications_friendsonline.png",
			BotMessages: map[string]FacebookBotMessageMediaInput{
				"welcome": FacebookBotMessageMediaInput{
					ShortDesc: "message for player after closing the session for the first time",
					ImageURL:  "https://webhook.nowwa.com/Coin_Cats_Notifications_Welcome.png",
					Text:      "Welcome to Coin Cats!",
					Subtitle:  "Funtabulous Bowling",
				},
				"replay": FacebookBotMessageMediaInput{
					ShortDesc: "message for player after 10 minutes of last playing session",
					ImageURL:  "https://webhook.nowwa.com/Coin_Cats_Notifications_Welcome.png",
					Text:      "Thank you for playing!",
					Subtitle:  "Funtabulous Bowling",
				},
			},
			Notifications: []GameFacebookNotification{
				GameFacebookNotification{
					TimeSpan: 7 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "free coins",
							LongDesc:  "free coins after 7 days offline",
							ImageURL:  "https://webhook.nowwa.com/Coin_Cats_Notifications_Welcome.png",
							Text:      "claim your free coins now!",
							Subtitle:  "Funtabulous Bowling",
						},
					},
				},
				GameFacebookNotification{
					TimeSpan: 2 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "daily reward",
							LongDesc:  "daily reward after 2 days offline",
							ImageURL:  "https://webhook.nowwa.com/Coin_Cats_Notifications_Welcome.png",
							Text:      "claim your daily rewards now!",
							Subtitle:  "Funtabulous Bowling",
						},
					},
				},
				GameFacebookNotification{
					TimeSpan: 1 * 24 * 3600 * 1000,
					PossibleMessages: []FacebookBotMessageMediaInput{
						FacebookBotMessageMediaInput{
							ShortDesc: "spins_are_full",
							LongDesc:  "indicates the spins are full",
							ImageURL:  "https://webhook.nowwa.com/Coin_Cats_Notifications_Welcome.png",
							Text:      "your spins are full! play now!",
							Subtitle:  "Funtabulous Bowling",
						},
						FacebookBotMessageMediaInput{
							ShortDesc: "idle_earnings",
							LongDesc:  "indicates there are coins can be collected from idle time",
							Text:      "collect your coins now!",
							Subtitle:  "Funtabulous Bowling",
						},
					},
				},
			},
		},
	}
	return games
}
