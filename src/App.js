import React, { useState } from "react";
import "./App.css";

function App() {
  const [binaryData, setBinaryData] = useState("");
  const [encoding, setEncoding] = useState("");

  const binaryDigits = binaryData
    .split("")
    .filter((digit) => digit === "0" || digit === "1");

  const getEncodingResults = () => {
    if (binaryDigits.length === 0) return {};

    const results = {
      "NRZ-L": binaryDigits.map((digit) => (digit === "1" ? "High" : "Low")),
      "NRZ-I": (() => {
        let currentLevel = "Low";
        return binaryDigits.map((digit) => {
          if (digit === "1") {
            currentLevel = currentLevel === "Low" ? "High" : "Low";
            return currentLevel;
          } else {
            return currentLevel;
          }
        });
      })(),
      "Bipolar AMI": (() => {
        let lastLevel = "Low";
        return binaryDigits.map((digit) => {
          if (digit === "1") {
            const currentLevel = lastLevel === "High" ? "Low" : "High";
            lastLevel = currentLevel;
            return currentLevel;
          } else {
            return "No Signal";
          }
        });
      })(),
      Pseudoternary: (() => {
        let lastLevel = "Low";
        return binaryDigits.map((digit) => {
          if (digit === "1") {
            return "No Signal";
          } else {
            lastLevel = lastLevel === "High" ? "Low" : "High";
            return lastLevel;
          }
        });
      })(),
      Manchester: binaryDigits.map((digit) => {
        let result;
        if (digit === "0") {
          result = "High to Low";
        } else {
          result = "Low to High";
        }
        return result;
      }),

      DifferentialManchesterLow: (() => {
        let currentLevel = "Low";
        return binaryDigits.map((digit, index) => {
          const previousDigit = index > 0 ? binaryDigits[index - 1] : null;
          const previousLevel = index > 0 ? currentLevel : null;

          if (previousDigit === null) {
            if (digit === "0") {
              currentLevel = "High";
              return "Transition " + currentLevel;
            } else {
              return "No Transition " + currentLevel;
            }
          }
          if (digit === "0") {
            if (previousDigit === "1") {
              if (previousLevel === "Low") {
                currentLevel = "Low";
              } else {
                currentLevel = "High";
              }
            }
            return "Transition " + currentLevel;
          }

          if (digit === "1") {
            if (previousLevel === "High") {
              currentLevel = "Low";
            } else {
              currentLevel = "High";
            }
            return "No Transition " + currentLevel;
          }
        });
      })(),

      DifferentialManchesterHigh: (() => {
        let currentLevel = "High";
        return binaryDigits.map((digit, index) => {
          const previousDigit = index > 0 ? binaryDigits[index - 1] : null;
          const previousLevel = index > 0 ? currentLevel : null;

          if (previousDigit === null) {
            if (digit === "0") {
              currentLevel = "Low";
              return "Transition " + currentLevel;
            } else {
              return "No Transition " + currentLevel;
            }
          }
          if (digit === "0") {
            if (previousDigit === "1") {
              if (previousLevel === "Low") {
                currentLevel = "Low";
              } else {
                currentLevel = "High";
              }
            }
            return "Transition " + currentLevel;
          }

          if (digit === "1") {
            if (previousLevel === "High") {
              currentLevel = "Low";
            } else {
              currentLevel = "High";
            }
            return "No Transition " + currentLevel;
          }
        });
      })(),
    };

    return results;
  };

  const encodingResults = getEncodingResults();

  const getLinePosition = (result, encoding) => {
    let lineClasses = "";

    switch (result) {
      case "High":
      case "Positive":
        lineClasses = "line-high";
        break;
      case "Low":
      case "Negative":
        lineClasses = "line-low";
        break;
      case "No Signal":
        lineClasses = "line-no-signal";
        break;
      default:
        lineClasses = "";
    }

    return lineClasses;
  };

  const getVerticalLinePosition = (result, previousResult, encoding) => {
    if (
      previousResult === "High" &&
      (result === "Low" || result === "Negative")
    ) {
      return "verticalline-full";
    }

    if (
      previousResult === "Low" &&
      (result === "High" || result === "Positive")
    ) {
      return "verticalline-full";
    }

    if (
      (previousResult === "Low to High" && result === "Low to High") ||
      (previousResult === "High to Low" && result === "High to Low")
    ) {
      return "verticalline-full";
    }

    if (result === "Transition High" || result === "Transition Low") {
      return "verticalline-full";
    }

    if (previousResult === "High" && result === "No Signal") {
      return "verticalline-upperhalf";
    }

    if (previousResult === "Low" && result === "No Signal") {
      return "verticalline-lowerhalf";
    }

    if (
      (previousResult === "No Signal" && result === "High") ||
      (previousResult === "High" && result === "No Signal")
    ) {
      return "verticalline-upperhalf";
    }
    if (
      (previousResult === "No Signal" && result === "Low") ||
      (previousResult === "Low" && result === "No Signal")
    ) {
      return "verticalline-lowerhalf";
    }
  };

  const getManchesterLine1 = (result, encoding) => {
    let lineClasses = "";

    if (encoding === "Manchester") {
      switch (result) {
        case "Low to High":
          lineClasses = "line-low-to-high-lowerhalf";
          break;
        case "High to Low":
          lineClasses = "line-high-to-low-upperhalf";
          break;
        default:
          lineClasses = "";
      }
    }
    if (
      encoding === "DifferentialManchesterLow" ||
      encoding === "DifferentialManchesterHigh"
    ) {
      switch (result) {
        case "Transition High":
          lineClasses = "line-high-to-low-upperhalf";
          break;
        case "Transition Low":
          lineClasses = "line-low-to-high-lowerhalf";
          break;
        case "No Transition High":
          lineClasses = "line-high-to-low-upperhalf";
          break;
        case "No Transition Low":
          lineClasses = "line-low-to-high-lowerhalf";
          break;
        default:
          lineClasses = "";
      }
    }
    return lineClasses;
  };

  const getManchesterLineCenter = () => {
    return "verticalline-manchesterfull";
  };

  const getManchesterLine2 = (result, encoding) => {
    let lineClasses = "";

    if (encoding === "Manchester") {
      switch (result) {
        case "Low to High":
          lineClasses = "line-low-to-high-upperhalf";
          break;
        case "High to Low":
          lineClasses = "line-high-to-low-lowerhalf";
          break;
        default:
          lineClasses = "";
      }
    }
    if (
      encoding === "DifferentialManchesterLow" ||
      encoding === "DifferentialManchesterHigh"
    ) {
      switch (result) {
        case "Transition High":
          lineClasses = "line-high-to-low-lowerhalf";
          break;
        case "Transition Low":
          lineClasses = "line-low-to-high-upperhalf";
          break;
        case "No Transition High":
          lineClasses = "line-high-to-low-lowerhalf";
          break;
        case "No Transition Low":
          lineClasses = "line-low-to-high-upperhalf";
          break;
        default:
          lineClasses = "";
      }
    }

    return lineClasses;
  };

  return (
    <>
    <div className="App">
      <div className="App-header">
        <h1>Digital Data with Digital Signal</h1>

        <div className="input-container">
          <label>
            Input Binary:
            <input
              className="binaryinput"
              type="text"
              value={binaryData}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^[01]*$/.test(newValue) || newValue === "") {
                  setBinaryData(newValue);
                }
              }}
              placeholder="Enter binary data"
            />
          </label>

          <label>
            Encoding Technique:
            <select
              className="encodingdropdown"
              value={encoding}
              onChange={(e) => setEncoding(e.target.value)}
            >
              <option value="">Select an encoding technique</option>
              <option value="NRZ-L">NRZ-L</option>
              <option value="NRZ-I">NRZ-I</option>
              <option value="Bipolar AMI">Bipolar AMI</option>
              <option value="Pseudoternary">Pseudoternary</option>
              <option value="Manchester">Manchester</option>
              <option value="DifferentialManchesterHigh">
                Differential Manchester - Initially High
              </option>
              <option value="DifferentialManchesterLow">
                Differential Manchester - Initially Low
              </option>
            </select>
          </label>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              {binaryDigits.map((digit, index) => (
                <th key={index}>{digit}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {encoding && encodingResults[encoding] && (
              <tr>
                {encodingResults[encoding].map((result, index) => {
                  const previousResult =
                    index > 0 ? encodingResults[encoding][index - 1] : "";

                  return (
                    <td key={index}>
                      {encoding === "Manchester" ||
                      encoding === "DifferentialManchesterHigh" ||
                      encoding === "DifferentialManchesterLow" ? (
                        <>
                          <div
                            className={`line ${getManchesterLine1(
                              result,
                              encoding
                            )}`}
                          ></div>
                          <div
                            className={`line ${getManchesterLineCenter()}`}
                          ></div>
                          <div
                            className={`line ${getManchesterLine2(
                              result,
                              encoding
                            )}`}
                          ></div>
                        </>
                      ) : (
                        <div
                          className={`line ${getLinePosition(
                            result,
                            encoding
                          )}`}
                        ></div>
                      )}

                      {getVerticalLinePosition(result, previousResult) && (
                        <div
                          className={getVerticalLinePosition(
                            result,
                            previousResult
                          )}
                        ></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
        <footer className="App-footer">
        <p>MendarosRitchelLabExer9</p>
      </footer>
      </div>
    </div>
    </>
  );
}

export default App;
