// Download CSV report for an audit session
query "reports/download-csv" verb=GET {
  api_group = "reports"
  auth = "user"

  input {
    int session_id
  }

  stack {
    // Call generate_csv_report function
    function.run generate_csv_report {
      input = {session_id: $input.session_id, user_id: $auth.id}
    } as $report
  
    // Check if report generation was successful
    conditional {
      if ($report.success == false) {
        throw {
          name = "ReportError"
          value = $report.error
            |first_notnull:"Failed to generate report"
        }
      }
    }
  
    // Set Content-Type header for CSV
    util.set_header {
      value = "Content-Type: text/csv; charset=utf-8"
      duplicates = "replace"
    }
  
    // Set Content-Disposition header for file download
    util.set_header {
      value = 'Content-Disposition: attachment; filename="audit-report.csv"'
      duplicates = "replace"
    }
  }

  response = $report.csv
}