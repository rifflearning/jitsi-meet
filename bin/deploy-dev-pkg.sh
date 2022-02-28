#! /usr/bin/env bash
################################################################################
# deploy-dev-pkg.sh                                                            #
################################################################################
#
# Deploy the jitsi-meet dev package to the specified instance
# The instance must be identified in the ~/.ssh/config
#

# Quick test to see if this script is being sourced
# https://stackoverflow.com/a/28776166/2184226
(return 0 2>/dev/null) && sourced=1 || sourced=0

if [[ $sourced -eq 1 ]]
then
    echo "This script must not be sourced!"
    return 1
fi

################################################################################
# Constants                                                                    #
################################################################################

# parameters for formatting the output to the console
# use like this: echo "Note: ${RED}Highlight this important${RESET} thing."
RESET=`tput -Txterm sgr0`
BOLD=`tput -Txterm bold`
BLACK=`tput -Txterm setaf 0`
RED=`tput -Txterm setaf 1`
GREEN=`tput -Txterm setaf 2`
YELLOW=`tput -Txterm setaf 3`
BLUE=`tput -Txterm setaf 4`
MAGENTA=`tput -Txterm setaf 5`
CYAN=`tput -Txterm setaf 6`
WHITE=`tput -Txterm setaf 7`

################################################################################
# Command Options and Arguments                                                #
################################################################################
# Initialized to default values
# boolean values (0,1) should be tested using (( ))
JITSI_PKG_NAME=rifflearning-jitsi-meet-dev.tar.bz2
GIT_USER=$(git config --get user.name)
AWS_NAME=

################################################################################
# Help                                                                         #
################################################################################
Help()
{
    # Display Help
    echo "Install a jitsi-meet package on an AWS instance"
    echo
    echo "${BOLD}Note:${RESET} The given AWS instance name ${BOLD}${GREEN}must${RESET} have an entry in your ~/.ssh/config"
    echo "      that specifies the ssh key to use as well as the login user on that instance (e.g. ubuntu)."
    echo
    echo "Syntax: $0 [-h] [-P <package name>] [-n <developer name>] <AWS instance name>"
    echo "options:"
    echo "P     The package file to be installed. Defaults to '$JITSI_PKG_NAME'"
    echo "n     The name of the installing developer. Defaults to '$GIT_USER'"
    echo "i     [Not Implemented] The ssh key file (aka identity file)"
    echo "l     [Not Implemented] The login user name for the AWS instance"
    echo "h     Print this Help."
}

################################################################################
# ParseOptions                                                                 #
################################################################################
ParseOptions()
{
    local OPTIND

    while getopts ":hP:n:" option; do
        case $option in
            P) # The package file to be installed
                JITSI_PKG_NAME=${OPTARG}
                ;;
            n) # The name of the installing developer
                GIT_USER=${OPTARG}
                ;;
            h) # display Help
                Help
                exit -1
                ;;
            \?) # incorrect option
                echo "Error: Invalid option. Use -h for help."
                exit -1
                ;;
        esac
    done

    # set the OPTION_ARG_CNT so the caller can shift away the processed options
    # shift $OPTION_ARG_CNT
    let OPTION_ARG_CNT=OPTIND-1
}
################################################################################
################################################################################
# Process the input options, validate arguments.                               #
################################################################################
ParseOptions "$@"
shift $OPTION_ARG_CNT

# Test validity of and set required arguments
## There are no additional arguments at this time ##

if [ $# -ne 1 ]; then
    echo "Error: One and only one argument is required. Run '$0 -h'"
    exit -1
fi

AWS_NAME=$1


################################################################################
################################################################################
# Main program                                                                 #
################################################################################
################################################################################

echo "${BOLD}${JITSI_PKG_NAME}${RESET} is being installed on ${BOLD}${AWS_NAME}${RESET} by ${BOLD}${GIT_USER}${RESET}..."

scp "${JITSI_PKG_NAME}" ${AWS_NAME}:/home/ubuntu/tmp
ssh ${AWS_NAME} "bin/install-riff-jitsi.sh 'tmp/${JITSI_PKG_NAME}' '${GIT_USER}'"
