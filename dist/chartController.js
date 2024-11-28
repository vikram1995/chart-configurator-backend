import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chartsFilePath = path.join(__dirname, "charts.json");
// Add Chart Function
export const addChart = async (req, res) => {
    const chartData = { ...req?.body };
    const filePath = path.join(__dirname, "charts.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err && err.code === "ENOENT") {
            // If the file doesn't exist, initialize with an empty array
            const initialData = [];
            saveDataToFile(initialData);
        }
        else if (err) {
            res.status(500).json({ error: "Failed to read file" });
            return;
        }
        else {
            const currentData = JSON.parse(data);
            currentData.push({ ...chartData, id: Date.now() });
            saveDataToFile(currentData);
        }
        function saveDataToFile(data) {
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    res.status(500).json({ error: "Failed to save data" });
                }
                else {
                    res
                        .status(200)
                        .json({ message: "Chart saved successfully!", charts: data });
                }
            });
        }
    });
};
// Get Paginated Charts
export const getChart = (req, res) => {
    const { page = "1", limit = "10" } = req.query; // Default to page 1, limit 10
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    fs.readFile(chartsFilePath, "utf8", (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                res.status(404).json({ error: "Charts file not found" });
                return;
            }
            res.status(500).json({ error: "Failed to read charts file" });
            return;
        }
        try {
            const charts = JSON.parse(data || "[]");
            // Calculate pagination indices
            const startIndex = (parsedPage - 1) * parsedLimit;
            const endIndex = startIndex + parsedLimit;
            // Paginate results
            const paginatedCharts = charts.slice(startIndex, endIndex);
            // Determine if more data is available
            const hasMore = endIndex < charts.length;
            const response = {
                charts: paginatedCharts,
                currentPage: parsedPage,
                totalPages: Math.ceil(charts.length / parsedLimit),
                hasMore,
            };
            res.status(200).json(response);
        }
        catch (parseError) {
            res.status(500).json({ error: "Failed to parse charts file" });
        }
    });
};
// Update Chart Function
export const updateChart = (req, res) => {
    const chartId = parseInt(req.params.id); // Get chart ID from URL params
    const updatedChart = req.body; // Get updated chart data from request body
    const filePath = path.join(__dirname, "charts.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to read file" });
            return;
        }
        const currentData = JSON.parse(data);
        const chartIndex = currentData.findIndex((chart) => chart.id === chartId);
        if (chartIndex === -1) {
            res.status(404).json({ error: "Chart not found" });
            return;
        }
        // Update the chart data
        currentData[chartIndex] = { ...currentData[chartIndex], ...updatedChart };
        // Save the updated chart list back to the file
        fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to save data" });
            }
            else {
                res.status(200).json({
                    message: "Chart updated successfully!",
                    charts: currentData,
                });
            }
        });
    });
};
// Remove Chart Function
export const removeChart = (req, res) => {
    const chartId = parseInt(req.params.id); // Get chart ID from URL params
    const filePath = path.join(__dirname, "charts.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to read file" });
            return;
        }
        const currentData = JSON.parse(data);
        const chartIndex = currentData.findIndex((chart) => chart.id === chartId);
        if (chartIndex === -1) {
            res.status(404).json({ error: "Chart not found" });
            return;
        }
        // Remove the chart
        currentData.splice(chartIndex, 1);
        // Save the updated chart list back to the file
        fs.writeFile(filePath, JSON.stringify(currentData, null, 2), (err) => {
            if (err) {
                res.status(500).json({ error: "Failed to delete chart" });
            }
            else {
                res.status(200).json({
                    message: "Chart deleted successfully!",
                    charts: currentData,
                });
            }
        });
    });
};
