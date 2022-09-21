package main

import (
	"encoding/json"

	"github.com/heroiclabs/nakama-common/runtime"
)

// DataInfo : Struct for data access
type DataInfo struct {
	Owner string `json:"owner"`
	Key   string `json:"key"`
}

// DataCreateInfo : Create info structure
func DataCreateInfo(owner string, key string) *DataInfo {
	output := DataInfo{
		Owner: owner,
		Key:   key,
	}
	return &output
}

// DataSave : Save data
func DataSave(c Core, gameID string, info *DataInfo, data interface{}) error {

	dataBytes, err := json.Marshal(data)
	if err != nil {
		return err
	}

	dataString := string(dataBytes)

	writeObjectIDs := []*runtime.StorageWrite{
		&runtime.StorageWrite{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
			Value:      dataString,
		},
	}

	_, err = c.nk.StorageWrite(c.ctx, writeObjectIDs)
	if err != nil {
		return err
	}

	return nil
}

// DataLoad : Load data
func DataLoad(c Core, gameID string, info *DataInfo) (*string, error) {

	readObjectIDs := []*runtime.StorageRead{
		&runtime.StorageRead{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
		},
	}

	records, err := c.nk.StorageRead(c.ctx, readObjectIDs)
	if err != nil {
		return nil, err
	}

	if len(records) == 0 {
		return nil, nil
	}

	return &(records[0].Value), nil
}

// DataLoadMultiple : Load multiple data
func DataLoadMultiple(c Core, gameID string, infos []*DataInfo) (map[string]*string, error) {

	readObjectIDs := make([]*runtime.StorageRead, len(infos))
	for index, info := range infos {
		readObjectIDs[index] = &runtime.StorageRead{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
		}
	}

	records, err := c.nk.StorageRead(c.ctx, readObjectIDs)
	if err != nil {
		return nil, err
	}

	output := make(map[string]*string)

	if len(records) == 0 {
		return output, nil
	}

	for _, record := range records {
		output[record.Key] = &record.Value
	}
	return output, nil
}

// DataDelete : Delete data
func DataDelete(c Core, gameID string, info *DataInfo) error {

	deleteObjectIDs := []*runtime.StorageDelete{
		&runtime.StorageDelete{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
		},
	}

	err := c.nk.StorageDelete(c.ctx, deleteObjectIDs)
	if err != nil {
		return err
	}

	return nil
}

// DataDeleteMultiple : Delete multiple data
func DataDeleteMultiple(c Core, gameID string, infos []*DataInfo) error {

	deleteObjectIDs := make([]*runtime.StorageDelete, len(infos))
	for index, info := range infos {
		deleteObjectIDs[index] = &runtime.StorageDelete{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
		}
	}

	err := c.nk.StorageDelete(c.ctx, deleteObjectIDs)
	if err != nil {
		return err
	}

	return nil
}

// DataSaveKey : Save data by specific key & value
func DataSaveKey(c Core, gameID string, info *DataInfo, key string, value interface{}) error {

	dataString, err := DataLoad(c, gameID, info)
	if err != nil {
		return err
	}

	if dataString != (*string)(nil) {

		var data map[string]interface{}
		if err := json.Unmarshal([]byte(*dataString), &data); err != nil {
			return err
		}

		data[key] = value

		return DataSave(c, gameID, info, data)
	}

	newData := make(map[string]interface{})
	newData[key] = value
	return DataSave(c, gameID, info, newData)
}

// DataLoadKey : Load data by specific key & value
func DataLoadKey(c Core, gameID string, info *DataInfo, key string) (*string, error) {

	dataString, err := DataLoad(c, gameID, info)
	if err != nil {
		return nil, err
	}

	if dataString != (*string)(nil) {

		var data map[string]interface{}
		if err := json.Unmarshal([]byte(*dataString), &data); err != nil {
			return nil, err
		}

		value, ok := data[key]

		if ok {
			byteOutput, err := json.Marshal(value)
			if err != nil {
				return nil, err
			}
			output := string(byteOutput)
			return &output, nil
		}

		return nil, nil
	}

	return nil, nil
}

// DataLoadKeyMultiple : Load multiple data by specific key & value
func DataLoadKeyMultiple(c Core, gameID string, infos []*DataInfo, key string) (map[string]*string, error) {

	readObjectIDs := make([]*runtime.StorageRead, len(infos))
	for index, info := range infos {
		readObjectIDs[index] = &runtime.StorageRead{
			Collection: gameID,
			Key:        info.Key + "|" + info.Owner,
		}
	}

	records, err := c.nk.StorageRead(c.ctx, readObjectIDs)
	if err != nil {
		return nil, err
	}

	output := make(map[string]*string)

	if len(records) == 0 {
		return output, nil
	}

	for _, record := range records {
		var data map[string]interface{}
		err := json.Unmarshal([]byte(record.Value), &data)
		if err != nil {
			// handle error
			continue
		}
		value, ok := data[key]
		if ok {
			bytesValue, err := json.Marshal(value)
			if err != nil {
				// handle error
				continue
			}
			stringValue := string(bytesValue)
			output[record.Key] = &stringValue
		}

	}
	return output, nil
}
