package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/heroiclabs/nakama-common/runtime"
)

// Core : base struct for nakama
type Core struct {
	ctx    context.Context
	logger runtime.Logger
	db     *sql.DB
	nk		runtime.NakamaModule
}

// Response : struct for function response
type Response struct {
	Success bool            `json:"success"`
	Data    json.RawMessage `json:"data"`
}

// CreateResponse : create Response value
func CreateResponse(success bool, jsonString string) Response {
	format := json.RawMessage(jsonString)
	return Response{
		success,
		format,
	}
}

// MessageResponse : create Message Response value
func MessageResponse(success bool, message string) Response {
	jsonString := strings.Replace(`{"message":"___"}`, "___", message, 1)
	return CreateResponse(success, jsonString)
}

// DefaultResponse : default Response value
func DefaultResponse() Response {
	return CreateResponse(false, "{}")
}

// JSONInterfaceToString : make string out of json interface
func JSONInterfaceToString(input interface{}) string {
	inputByte, err := json.Marshal(input)
	if err != nil {
		return "{}"
	}
	return string(inputByte)
}

// InterfaceToString : make string out of interface
func InterfaceToString(input interface{}) string {
	return fmt.Sprintf("%v", input)
}

// IndexValue : get element index from an array
func IndexValue(tbl []string, val string) int {
	for index, value := range tbl {
		if val == value {
			return index
		}
	}
	return -1
}

// GetNowMillisecond : get current time in millisecond
func GetNowMillisecond() int64 {
	return time.Now().UnixNano() / int64(1000000)
}

// GetWeek : get current week (0~3)
func GetWeek() int {
	now := GetNowMillisecond()
	return int(math.Floor(float64(now) / (float64(3600*24*7) * float64(1000))))
}

type errorString struct {
	s string
}

func (e *errorString) Error() string {
	return e.s
}
