#!/bin/bash
#
# Tracebacks in bash
# https://docwhat.org/tracebacks-in-bash/
#
# Just take the code between the "cut here" lines
# and put it in your own program.
#
# Written by Christian Höltje
# Donated to the public domain in 2013

#--------->8---------cut here---------8<---------
set -eu

trap _exit_trap EXIT
trap _err_trap ERR
_showed_traceback=f

function _exit_trap
{
  local _ec="$?"
  if [[ $_ec != 0 && "${_showed_traceback}" != t ]]; then
    traceback 1
  fi
}

function _err_trap
{
  local _ec="$?"
  local _cmd="${BASH_COMMAND:-unknown}"
  traceback 1
  _showed_traceback=t
  echo "The command ${_cmd} exited with exit code ${_ec}." 1>&2
}

function traceback
{
  # Hide the traceback() call.
  local -i start=$(( ${1:-0} + 1 ))
  local -i end=${#BASH_SOURCE[@]}
  local -i i=0
  local -i j=0

  echo "Traceback (last called is first):" 1>&2
  for ((i=start; i < end; i++)); do
    j=$(( i - 1 ))
    local function="${FUNCNAME[$i]}"
    local file="${BASH_SOURCE[$i]}"
    local line="${BASH_LINENO[$j]}"
    echo "     ${function}() in ${file}:${line}" 1>&2
  done
}
#--------->8---------cut here---------8<---------

########
## Demos

function bomb
{
  trap _err_trap ERR
  local limit=${1:-5}
  echo -n " ${limit}"
  if [ "${limit}" -le 0 ]; then
    echo " BOOM"
    return 10
  else
    bomb $(( limit - 1 ))
  fi
}

function stack
{
  stack_1
}
function stack_1
{
  stack_2
}
function stack_2
{
  stack_3
}
function stack_3
{
  no_such_function
}

#######
## Main

case "${1:-}" in
  stack)
    stack;;
  bomb)
    echo -n "Counting down..."; bomb ;;
  badvar)
    echo "This shouldn't be shown because ${bad_variable} isn't set";;
  false)
    false;;
  true)
    true;;
  *)
    echo "Usage: $0 [bomb|badvar|true|false|stack]"
    ;;
esac

# EOF
