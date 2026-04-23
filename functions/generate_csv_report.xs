// Generates a CSV report for an audit session
function generate_csv_report {
  input {
    int session_id
    int user_id
  }

  stack {
    var $result {
      value = {success: false, csv: null, error: null}
    }
  
    try_catch {
      try {
        // Get user context for multi-tenant security
        function.run get_user_context {
          input = {user_id: $input.user_id}
        } as $user_context
      
        // Check if user exists
        conditional {
          if ($user_context.success == false) {
            var.update $result {
              value = $result|set:"error":"User not found"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Fetch the session
        db.get audit_session {
          field_name = "id"
          field_value = $input.session_id
        } as $session
      
        conditional {
          if ($session == null) {
            var.update $result {
              value = $result|set:"error":"Session not found"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Verify session belongs to user's account
        conditional {
          if ($session.account_id != $user_context.user.account_id) {
            var.update $result {
              value = $result
                |set:"error":"Unauthorized: Session belongs to another account"
            }
          
            return {
              value = $result
            }
          }
        }
      
        // Build CSV header row
        var $csv_output {
          value = 'Serial,Activated,Subscription Expires,First Report Date,Last Report Date,GPS Signal,Last Known Location,IP Port,Battery,"Lat, Long",Company,Group,Notes,Stock,Vehicle name,VIN,"Year, Make, Model",Color,Initial Odometer,Odometer,Last Install Odometer,Current Odometer,Vehicle Type,License Plate,Price (MSRP),Installation,Install Date,Install Location,Installer Name,Starter Interrupt Installed'
        }
      
        // Fetch all scans for this session
        db.query scan {
          where = $db.scan.audit_session_id == $input.session_id && $db.scan.account_id == $user_context.user.account_id
          return = {type: "list"}
        } as $scans
      
        // Build CSV rows from scan data
        foreach ($scans) {
          each as $scan {
            // Extract fields we have now, empty string for fields pending API integration
            var $serial {
              value = $scan.serial|first_notnull:""
            }
          
            var $activated {
              value = $scan.activated_at|first_notnull:""
            }
          
            var $last_report {
              value = $scan.last_report_date|first_notnull:""
            }
          
            var $company {
              value = $scan.company|first_notnull:""
            }
          
            var $group {
              value = $scan.group|first_notnull:""
            }
          
            var $notes {
              value = $scan.notes|first_notnull:""
            }
          
            var $vin {
              value = $scan.vin|first_notnull:""
            }
          
            // Extract from device_data JSON (populated after API integration)
            var $dd {
              value = $scan.device_data|first_notnull:{}
            }
          
            var $sub_expires {
              value = $dd
                |get:"subscription_expires":""
                |first_notnull:""
            }
          
            var $first_report {
              value = $dd
                |get:"first_report_date":""
                |first_notnull:""
            }
          
            var $gps_signal {
              value = $dd
                |get:"gps_signal":""
                |first_notnull:""
            }
          
            var $last_location {
              value = $dd
                |get:"last_known_location":""
                |first_notnull:""
            }
          
            var $ip_port {
              value = $dd
                |get:"ip_port":""
                |first_notnull:""
            }
          
            var $battery {
              value = $dd
                |get:"battery":""
                |first_notnull:""
            }
          
            var $lat_long {
              value = $dd
                |get:"lat_long":""
                |first_notnull:""
            }
          
            var $stock {
              value = $dd|get:"stock":""|first_notnull:""
            }
          
            var $vehicle_name {
              value = $dd
                |get:"vehicle_name":""
                |first_notnull:""
            }
          
            var $ymm {
              value = $dd
                |get:"year_make_model":""
                |first_notnull:""
            }
          
            var $color {
              value = $dd|get:"color":""|first_notnull:""
            }
          
            var $initial_odo {
              value = $dd
                |get:"initial_odometer":""
                |first_notnull:""
            }
          
            var $odometer {
              value = $dd
                |get:"odometer":""
                |first_notnull:""
            }
          
            var $last_install_odo {
              value = $dd
                |get:"last_install_odometer":""
                |first_notnull:""
            }
          
            var $current_odo {
              value = $dd
                |get:"current_odometer":""
                |first_notnull:""
            }
          
            var $vehicle_type {
              value = $dd
                |get:"vehicle_type":""
                |first_notnull:""
            }
          
            var $license_plate {
              value = $dd
                |get:"license_plate":""
                |first_notnull:""
            }
          
            var $price {
              value = $dd
                |get:"price_msrp":""
                |first_notnull:""
            }
          
            var $installation {
              value = $dd
                |get:"installation":""
                |first_notnull:""
            }
          
            var $install_date {
              value = $dd
                |get:"install_date":""
                |first_notnull:""
            }
          
            var $install_location {
              value = $dd
                |get:"install_location":""
                |first_notnull:""
            }
          
            var $installer_name {
              value = $dd
                |get:"installer_name":""
                |first_notnull:""
            }
          
            var $starter_interrupt {
              value = $dd
                |get:"starter_interrupt_installed":""
                |first_notnull:""
            }
          
            // Build row: all 30 columns
            var $row {
              value = $serial ~ "," ~ $activated ~ "," ~ $sub_expires ~ "," ~ $first_report ~ "," ~ $last_report ~ "," ~ $gps_signal ~ "," ~ $last_location ~ "," ~ $ip_port ~ "," ~ $battery ~ "," ~ $lat_long ~ "," ~ $company ~ "," ~ $group ~ "," ~ $notes ~ "," ~ $stock ~ "," ~ $vehicle_name ~ "," ~ $vin ~ "," ~ $ymm ~ "," ~ $color ~ "," ~ $initial_odo ~ "," ~ $odometer ~ "," ~ $last_install_odo ~ "," ~ $current_odo ~ "," ~ $vehicle_type ~ "," ~ $license_plate ~ "," ~ $price ~ "," ~ $installation ~ "," ~ $install_date ~ "," ~ $install_location ~ "," ~ $installer_name ~ "," ~ $starter_interrupt
            }
          
            // Append row to CSV output
            var.update $csv_output {
              value = $csv_output ~ "\n" ~ $row
            }
          }
        }
      
        // Update session with report generation timestamp
        db.edit audit_session {
          field_name = "id"
          field_value = $input.session_id
          data = {report_generated_at: now}
        } as $updated_session
      
        var.update $result {
          value = $result
            |set:"success":true
            |set:"csv":$csv_output
            |set:"total_rows":($scans|count)
        }
      }
    
      catch {
        var.update $result {
          value = $result
            |set:"error":"An unexpected error occurred"
        }
      
        function.run heartbeat_log {
          input = {
            level  : "error"
            message: {
            source    : "generate_csv_report"
            session_id: $input.session_id
            user_id   : $input.user_id
            error     : "Unexpected error in generate_csv_report"
          }
          }
        } as $log
      }
    }
  }

  response = $result
}