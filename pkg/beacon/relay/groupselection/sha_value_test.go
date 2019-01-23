package groupselection

import (
	"fmt"
	"reflect"
	"testing"

	"github.com/keep-network/keep-core/pkg/internal/testutils"
)

func TestSetBytes(t *testing.T) {

	tests := map[string]struct {
		inputBytes    []byte
		expectedError error
	}{
		"less than 32 bytes": {
			inputBytes: []byte{
				0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x10,
				0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x20,
				0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x30,
				0x31,
			},
			expectedError: fmt.Errorf("32 bytes expected for SHA value"),
		},
		"32 bytes": {
			inputBytes: []byte{
				0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x10,
				0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x20,
				0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x30,
				0x31, 0x32,
			},
		},
		"more than 32 bytes": {
			inputBytes: []byte{
				0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x10,
				0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x20,
				0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x30,
				0x31, 0x32, 0x33,
			},
			expectedError: fmt.Errorf("32 bytes expected for SHA value"),
		},
	}

	for testName, test := range tests {
		t.Run(testName, func(t *testing.T) {
			shaValue, err := SHAValue{}.SetBytes(test.inputBytes)

			if !reflect.DeepEqual(test.expectedError, err) {
				t.Errorf(
					"unexpected error\nexpected: [%v]\nactual: [%v]",
					test.expectedError,
					err,
				)
			}

			if test.expectedError == nil {
				testutils.AssertBytesEqual(t, test.inputBytes, shaValue.Bytes())
			}
		})
	}
}
