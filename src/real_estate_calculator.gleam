import gleam/float
import gleam/format
import gleam/io
import gleam/string
import gleam/int
import input.{input}

pub type Commission {
  Commission(s_price: Float, c_rate: Float, t_rate: Float)
}
pub fn main() {
  run_app()
}

fn run_app() {
  io.println("Input Property Code")
  io.println("R - Residential || C - Commercial || G - Agricultural")
  let com_rate = get_pcode()

  io.println("Input Broker Code")
  io.println("I - In-house || A - Accredited || F - Referral")
  let tax_rate = get_bcode()

  let srp = get_price()

  let comm_data = Commission(s_price: srp, c_rate: com_rate, t_rate: tax_rate)
  display_results(comm_data)

  io.println("\n\nDo you want to restart? Y - Restart || Any letter - Exit")

  case input(prompt: "Your Choice: ") {
    Ok(choice) -> {
      case string.uppercase(choice) {
        "Y" -> run_app()
        _ -> io.println("Exiting...")
      }
    }
    Error(_) -> io.println("Error reading input. Exiting.")
  }
}


fn get_pcode() -> Float {
  case input(prompt: "") {
    Ok(str) -> {
      let clean_str = string.trim(str) |> string.uppercase

      case string.pop_grapheme(clean_str) {
        Ok(#(char, _)) -> {
          case is_letter(char) {
            False -> {
              io.println("INVALID INPUT! Letters only.")
              get_pcode()
            }
            True -> {
              case char {
                "R" -> 0.056
                "C" -> 0.045
                "G" -> 0.0385
                _ -> {
                  io.println("INVALID! Refer to the choices only.")
                  get_pcode()
                }
              }
            }
          }
        }
        Error(_) -> {
          io.println("INVALID! Try again.")
          get_pcode()
        }
      }
    }
    Error(_) -> {
      io.println("INVALID! Try again.")
      get_pcode()
    }
  }
}

fn get_bcode() -> Float {
  case input(prompt: "") {
    Ok(str) -> {
      let clean_str = string.trim(str) |> string.uppercase
      case string.pop_grapheme(clean_str) {
        Ok(#(char, _)) -> {
          case is_letter(char) {
            False -> {
              io.println("Invalid Input! Letters only.")
              get_bcode()
            }
            True -> {
              case char {
                "I" -> 0.218
                "A" -> 0.235
                "F" -> 0.098
                _ -> {
                  io.println("INVALID! Refer to the choices only.")
                  get_bcode()
                }
              }
            }
          }
        }
        Error(_) -> {
          io.println("INVALID! Try again.")
          get_bcode()
        }
      }
    }
    Error(_) -> {
      io.println("INVALID! Try again.")
      get_bcode()
    }
  }
}

fn get_price() -> Float {
  case input(prompt: "Input sale price: ") {
    Ok(str) -> {
      let clean_str = string.trim(str)

      case float.parse(clean_str) {
        Ok(val) -> check_negative(val)
        Error(Nil) -> {
          case int.parse(clean_str) {
            Ok(int_val) -> check_negative(int.to_float(int_val))
            Error(Nil) -> {
              io.println("INVALID! Numbers only.")
              get_price()
            }
          }
        }
      }
    }
    Error(_) -> {
      io.println("INVALID! Try again")
      get_price()
    }
  }
}

fn check_negative(val: Float) -> Float {
  case val <. 0.0 {
    True -> {
      io.println("INVALID! Non-negative numbers only.")
      get_price()
    }
    False -> val
  }
}


fn is_letter(char: String) -> Bool {
  let lower = string.lowercase(char)
  let upper = string.uppercase(char)
  lower != upper
}


fn gross_rate(comm: Commission) -> Float {
  case comm.s_price >=. 20_000_000.0 {
    True -> comm.s_price *. { comm.c_rate +. 0.015 }
    False -> comm.s_price *. comm.c_rate
  }
}

fn tax(comm: Commission) -> Float {
  gross_rate(comm) *. comm.t_rate
}

fn net_com(comm: Commission) -> Float {
  gross_rate(comm) -. tax(comm)
}

fn display_results(comm: Commission) {
  let gross = gross_rate(comm)
  let net = net_com(comm)

  let assert Ok(gross_str) = format.sprintf("~.2f", [gross])
  let assert Ok(net_str) = format.sprintf("~.2f", [net])
  io.println("\nGross Commission: " <> gross_str)
  io.println("Net Commission: " <> net_str)
}
