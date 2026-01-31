auto_auth {
  method {
    type      = "approle"
    config = {
      role_id_file_path = "/run/secrets/postgres_roleid"
      secret_id_file_path = "/run/secrets/postgres_secretid"
      secret_id_response_wrapping_path="auth/approle/role/postgres/secret-id"
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
  source = "/vault/local/postgres.ctmpl"
  destination = "/dev/null"
}

template_config {
  passthrough_request_headers = ["X-Vault-Token"]
}
