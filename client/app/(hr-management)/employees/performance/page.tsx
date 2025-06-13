"use client";

import { 
  TrendingUp, 
  TrendingDown, 
  Psychology, 
  Work, 
  Group,
  Search,
  FilterList,
  Star,
  Description,
  Edit
} from "@mui/icons-material";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { performanceData } from "../../../../data/performance-data";
import { employeesData } from "../../../../data/employees-data";

export default function Performance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Filter and search functionality
  const filteredPerformance = useMemo(() => {
    return performanceData.filter((performance) => {
      const matchesSearch = performance.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || performance.status === statusFilter;
      
      let matchesRating = true;
      if (ratingFilter !== "all") {
        const rating = performance.rating;
        switch (ratingFilter) {
          case "excellent":
            matchesRating = rating >= 4.5;
            break;
          case "good":
            matchesRating = rating >= 3.5 && rating < 4.5;
            break;
          case "average":
            matchesRating = rating >= 2.5 && rating < 3.5;
            break;
          case "poor":
            matchesRating = rating < 2.5;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [searchTerm, statusFilter, ratingFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReviews = performanceData.length;
    const completedReviews = performanceData.filter(perf => perf.status === "Completed").length;
    const pendingReviews = performanceData.filter(perf => perf.status === "Pending").length;
    const overdueReviews = performanceData.filter(perf => perf.status === "Overdue").length;
    const averageRating = performanceData.reduce((acc, perf) => acc + perf.rating, 0) / totalReviews;
    const excellentRatings = performanceData.filter(perf => perf.rating >= 4.5).length;

    return {
      totalReviews,
      completedReviews,
      pendingReviews,
      overdueReviews,
      averageRating,
      excellentRatings
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceStatus = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    return 'Poor';
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'primary';
    if (rating >= 2.5) return 'warning';
    return 'error';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage employee performance reviews</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Total Reviews
                </Typography>
                <Typography variant="h4" component="div" className="font-bold">
                  {stats.totalReviews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Period
                </Typography>
              </div>
              <Psychology className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-green-600">
                  {stats.completedReviews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reviews Done
                </Typography>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Average Rating
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-purple-600">
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of 5.0
                </Typography>
              </div>
              <Star className="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <Typography color="text.secondary" gutterBottom>
                  Excellent
                </Typography>
                <Typography variant="h4" component="div" className="font-bold text-orange-600">
                  {stats.excellentRatings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4.5+ Rating
                </Typography>
              </div>
              <Work className="text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 flex-1">
              <TextField
                label="Search employees"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search className="text-gray-400 mr-2" />,
                }}
                className="flex-1"
              />
              
              <FormControl size="small" className="min-w-32">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" className="min-w-32">
                <InputLabel>Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  label="Rating"
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  <MenuItem value="excellent">Excellent (4.5+)</MenuItem>
                  <MenuItem value="good">Good (3.5-4.4)</MenuItem>
                  <MenuItem value="average">Average (2.5-3.4)</MenuItem>
                  <MenuItem value="poor">Poor (2.5)</MenuItem>
                </Select>
              </FormControl>
            </div>

            <Button 
              variant="contained" 
              startIcon={<FilterList />}
              className="whitespace-nowrap"
            >
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <Typography variant="body2" color="text.secondary">
          Showing {filteredPerformance.length} of {performanceData.length} performance records
        </Typography>
      </div>

      {/* Performance Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Employee</TableCell>
                  <TableCell className="font-semibold">Review Period</TableCell>
                  <TableCell className="font-semibold">Rating</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Reviewer</TableCell>
                  <TableCell className="font-semibold">Review Date</TableCell>
                  <TableCell className="font-semibold">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPerformance.map((performance) => (
                  <TableRow key={performance.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          {performance.employeeName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" className="font-medium">
                          {performance.employeeName}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {performance.reviewPeriod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" className="font-medium">
                          {performance.rating}/5
                        </Typography>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < performance.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={performance.status}
                        color={getStatusColor(performance.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {performance.reviewer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(performance.reviewDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Description />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Performance">
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredPerformance.length === 0 && (
            <Box className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No performance records found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Review Status Summary
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed:</span>
                <span className="font-medium text-green-600">{stats.completedReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending:</span>
                <span className="font-medium text-yellow-600">{stats.pendingReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue:</span>
                <span className="font-medium text-red-600">{stats.overdueReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completion Rate:</span>
                <span className="font-medium text-green-600">
                  {((stats.completedReviews / stats.totalReviews) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" component="div" className="mb-4">
              Rating Distribution
            </Typography>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Excellent (4.5+):</span>
                <span className="font-medium text-green-600">{stats.excellentRatings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Good (3.5-4.4):</span>
                <span className="font-medium text-blue-600">
                  {performanceData.filter(perf => perf.rating >= 3.5 && perf.rating < 4.5).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average (2.5-3.4):</span>
                <span className="font-medium text-yellow-600">
                  {performanceData.filter(perf => perf.rating >= 2.5 && perf.rating < 3.5).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Poor (2.5):</span>
                <span className="font-medium text-red-600">
                  {performanceData.filter(perf => perf.rating < 2.5).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 