interface IProps {
    address: string;
    icon: string;
}

export const AirdropCard = ({address, icon}: IProps ) => {
    return <div>
        <img src={icon} alt="icon" />

        <div>
            <div>Address</div>
            <div>{address}</div>
        </div>

        <div>
            <div>It is possible to get an airdrop</div>
            <div>
                Yes
            </div>
        </div>

        <div>
            <div>Amount airdrop</div>
            <div>10000 aISLM</div>
        </div>

        <button>Airdrop Request</button>

    </div>
}