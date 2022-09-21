package main

// CronHourly : Called every hour
func CronHourly(c Core, payload string) error {
	return nil
}

// CronDaily : Called every day
func CronDaily(c Core, payload string) error {

	// Send all delayed bot messages
	_, err := FacebookSendDelayedBotMessages(c)
	if err != nil {
		return err
	}

	// Send all facebook notification
	if err := FacebookSendAllNotif(c); err != nil {
		return err
	}

	return nil
}

// Cron10Minutes : Called every 10 minutes
func Cron10Minutes(c Core, payload string) error {

	return nil
}
