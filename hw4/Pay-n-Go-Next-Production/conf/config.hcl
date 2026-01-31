ui = true
disable_mlock = "false"

storage "raft" {
  path    = "/vault/data"
  node_id = "node1"
}

listener "tcp" {
  address = "[::]:8200"
  tls_disable = "false"
  tls_cert_file = "/run/secrets/vault_certificate"
  tls_key_file  = "/run/secrets/vault_key"
}

api_addr = "https://localhost:8200"
cluster_addr = "https://localhost:8201"
