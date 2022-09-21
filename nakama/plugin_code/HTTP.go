package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// HTTP :  HTTP - Detailed struct for http request
type HTTP struct {
	Method    string              `json:"method"`
	TargetURL string              `json:"target_url"`
	Values    interface{}         `json:"values"`
	Headers   map[string][]string `json:"headers"`
}

// HTTPRequest :  HTTP - DoRequest
func HTTPRequest(c Core, input HTTP) (*string, error) {

	client := &http.Client{}

	objValues, err := json.Marshal(input.Values)
	if err != nil {
		return nil, err
	}

	values := bytes.NewBuffer(objValues)

	request, err := http.NewRequest(input.Method, input.TargetURL, values)
	if err != nil {
		return nil, err
	}

	for hkey, hvalues := range input.Headers {
		for _, hvalue := range hvalues {
			request.Header.Add(hkey, hvalue)
		}
	}

	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	stringBody := string(body)

	return &stringBody, nil
}
