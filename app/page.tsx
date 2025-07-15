"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Phone, Download, RefreshCw } from "lucide-react"

export default function VAPICallManager() {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [callResults, setCallResults] = useState<string[]>([])

  const mockResults = [
    "✅ Call initiated: John Doe (1234567890)",
    "✅ Call initiated: Jane Smith (9876543210)",
    "❌ Failed: Bob Johnson (555) - Invalid number format",
    "⚠️ Skipping invalid number: Alice - 123",
  ]

  const mockResponses = [
    {
      timestamp: "2024-01-15T10:30:00Z",
      callId: "call_123",
      phone: "+1234567890",
      status: "completed",
      agentResponse: "Hello, this is a test call from our system.",
      clientResponse: "Yes, I received the call successfully.",
      transcript: "Agent: Hello, this is a test call. Client: Thank you for calling.",
    },
    {
      timestamp: "2024-01-15T10:31:00Z",
      callId: "call_124",
      phone: "+9876543210",
      status: "failed",
      agentResponse: "Call could not be completed.",
      clientResponse: "",
      transcript: "No response received.",
    },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
  }

  const handleStartCampaign = () => {
    setCallResults(mockResults)
    setActiveTab("results")
  }

  const stats = {
    successful: mockResults.filter((r) => r.includes("✅")).length,
    failed: mockResults.filter((r) => r.includes("❌")).length,
    skipped: mockResults.filter((r) => r.includes("⚠️")).length,
    total: mockResults.length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Phone className="h-6 w-6" />
              VAPI Call Manager
            </h1>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === "upload" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("upload")}
                className="text-white hover:bg-white/20"
              >
                Upload Contacts
              </Button>
              <Button
                variant={activeTab === "results" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("results")}
                className="text-white hover:bg-white/20"
              >
                View Results
              </Button>
              <Button
                variant={activeTab === "responses" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("responses")}
                className="text-white hover:bg-white/20"
              >
                Call Responses
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">📋 Upload Contact List</CardTitle>
              <p className="text-gray-600">
                Upload an Excel file (.xlsx) with 'Name' and 'Phone' columns to initiate calls
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Drag & Drop your Excel file here</h3>
                  <p className="text-gray-500">or click to browse</p>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mt-2 bg-transparent">
                      Choose File
                    </Button>
                  </label>
                  <p className="text-sm text-gray-400">Supported format: .xlsx (Max size: 16MB)</p>
                </div>
              </div>

              {file && (
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handleStartCampaign}
                  disabled={!file}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  Start Calling Campaign
                </Button>
              </div>

              {/* Requirements */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📋 File Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Excel file format (.xlsx or .xls)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Must contain columns named 'Name' and 'Phone'
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Phone numbers should include country code
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        Maximum file size: 16MB
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">📊 Sample Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>John Doe</TableCell>
                          <TableCell>1234567890</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Jane Smith</TableCell>
                          <TableCell>9876543210</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "results" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">📞 Call Campaign Results</CardTitle>
                <p className="text-gray-600">Here are the results of your calling campaign</p>
              </CardHeader>
              <CardContent>
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                      <div className="text-sm text-green-700">Successful Calls</div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                      <div className="text-sm text-red-700">Failed Calls</div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.skipped}</div>
                      <div className="text-sm text-yellow-700">Skipped Numbers</div>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-sm text-blue-700">Total Processed</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>📋 Detailed Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {callResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg flex items-start gap-3 ${
                            result.includes("✅")
                              ? "bg-green-50 border border-green-200"
                              : result.includes("❌")
                                ? "bg-red-50 border border-red-200"
                                : "bg-yellow-50 border border-yellow-200"
                          }`}
                        >
                          <span className="text-lg">
                            {result.includes("✅") ? "✅" : result.includes("❌") ? "❌" : "⚠️"}
                          </span>
                          <span className="font-mono text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center gap-4 mt-6">
                  <Button variant="outline" onClick={() => setActiveTab("upload")}>
                    Upload Another File
                  </Button>
                  <Button onClick={() => setActiveTab("responses")}>View Call Responses</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "responses" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">📊 Call Responses Log</CardTitle>
                  <p className="text-gray-600">View all recorded call responses and transcripts</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input placeholder="Search responses..." className="w-full" />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Call ID</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent Response</TableHead>
                      <TableHead>Client Response</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockResponses.map((response, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {new Date(response.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm">{response.callId}</TableCell>
                        <TableCell className="font-mono">{response.phone}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              response.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {response.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{response.agentResponse}</TableCell>
                        <TableCell className="max-w-xs truncate">{response.clientResponse}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
