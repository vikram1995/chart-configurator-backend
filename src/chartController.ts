export const addChart = async (req, res) => {
  const { chartData } = req.body;

  const filePath = path.join(__dirname, "charts.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code === "ENOENT") {
      // If the file doesn't exist, initialize with an empty array
      const initialData = [];
      saveDataToFile(initialData);
    } else if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    } else {
      const currentData = JSON.parse(data);
      currentData.push({ ...chartData, id: Date.now() });
      saveDataToFile(currentData);
    }

    function saveDataToFile(data) {
      fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to save data" });
        }
        res.status(200).json({ message: "Chart saved successfully!" });
      });
    }
  });
};

export const updateChart = (req, res) => {
  const chartId = parseInt(req.params.id); // Get chart ID from URL params
  const updatedChart = req.body; // Get updated chart data from request body

  const filePath = path.join(__dirname, "charts.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    const currentData = JSON.parse(data);
    const chartIndex = currentData.findIndex((chart) => chart.id === chartId);

    if (chartIndex === -1) {
      return res.status(404).json({ error: "Chart not found" });
    }

    // Update the chart data
    currentData[chartIndex] = { ...currentData[chartIndex], ...updatedChart };

    // Save the updated chart list back to the file
    fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save data" });
      }
      res.status(200).json({ message: "Chart updated successfully!" });
    });
  });
};

export const removeChart = (req, res) => {
  const chartId = parseInt(req.params.id); // Get chart ID from URL params

  const filePath = path.join(__dirname, "charts.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read file" });
    }

    const currentData = JSON.parse(data);
    const chartIndex = currentData.findIndex((chart) => chart.id === chartId);

    if (chartIndex === -1) {
      return res.status(404).json({ error: "Chart not found" });
    }

    // Remove the chart
    currentData.splice(chartIndex, 1);

    // Save the updated chart list back to the file
    fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete chart" });
      }
      res.status(200).json({ message: "Chart deleted successfully!" });
    });
  });
};
