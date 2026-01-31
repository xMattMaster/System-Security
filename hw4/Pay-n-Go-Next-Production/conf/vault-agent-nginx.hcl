auto_auth {
  method {
    type      = "approle"
    config = {
      role_id_file_path = "/run/secrets/nginx_roleid"
      secret_id_file_path = "/run/secrets/nginx_secretid"
      secret_id_response_wrapping_path="auth/approle/role/nginx/secret-id"
      remove_secret_id_file_after_reading = false
    }
  }

  sink {
    type = "file"
    wrap_ttl = "10m"
    config = {
      path = "/vault/local/sink_file.txt"
      mode = 0600
    }
  }
}

template {
  source = "/vault/local/nginx.ctmpl"
  destination = "/dev/null"
}

template_config {
  passthrough_request_headers = ["X-Vault-Token"]
}
