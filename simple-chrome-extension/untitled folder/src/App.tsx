import "./App.css";

function App() {
  const onclick = async () => {
    let [tab] = await chrome.tabs.query({ active: true });

    chrome.scripting.executeScript<string[], void>({
      target: { tabId: tab.id! },
      args: [],
      func: () => {
        const getHourFromString = (s: string) => {
          const splitRowObject = s.split(":");
          return parseInt(splitRowObject[0]);
        };

        const getMinuteFromString = (s: string) => {
          const splitRowObject = s.split(":");
          return parseInt(splitRowObject[1]);
        };

        // =(HOUR(I5)*60+MINUTE(I5)-HOUR(H5)*60-MINUTE(H5))/60-1.5
        const countWorkingTime = (checkIn: string, checkOut: string) => {
          if (checkIn && checkOut) {
            const workingHour =
              Math.abs(
                getHourFromString(checkOut) * 60 +
                  getMinuteFromString(checkOut) -
                  getHourFromString(checkIn) * 60 -
                  getMinuteFromString(checkIn)
              ) /
                60 -
              1.5;

            return Math.floor(workingHour * 100) / 100;
          }
        };

        const tableElement = document.querySelector("table");
        tableElement?.setAttribute(
          "style",
          "grid-template-columns: 1fr 1fr 1fr 1fr; --data-table-library_grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr);"
        );

        const headerTr = document.querySelector("thead tr.tr");

        const thCell = document.createElement("th");
        thCell.className = "th css-1dpkmiw";
        thCell?.setAttribute("style", "text-align: left");
        headerTr?.appendChild(thCell);
        thCell.innerHTML = "Đủ công";

        const rowData = document.querySelectorAll("tbody tr.tr");
        for (const row of rowData) {
          const tdRowData = row.querySelectorAll("td.td div");
          const checkInTime = tdRowData[1].innerHTML;
          const checkOutTime = tdRowData[2].innerHTML;

          const countWorkingTimes = countWorkingTime(checkInTime, checkOutTime);
          let workingTime = "";
          if (countWorkingTimes && countWorkingTimes > 8) {
            workingTime = `<span style="color: green">${countWorkingTime(
              checkInTime,
              checkOutTime
            )}</span>`;
          } else {
            workingTime = `<span style="color: red; font-weight: bold">Đi làm ${countWorkingTimes} giờ (Không đủ công)</span>`;
          }

          const tdCell = document.createElement("td");
          tdCell.className = "td css-1u8mock";
          tdCell?.setAttribute("style", "text-align: left");
          row?.appendChild(tdCell);
          tdCell.innerHTML = workingTime;
        }
      },
    });
  };

  return (
    <>
      <div className="card">
        <button onClick={onclick}>Đếm thời gian chấm công</button>
      </div>
    </>
  );
}

export default App;
